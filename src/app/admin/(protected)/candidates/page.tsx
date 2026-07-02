import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Candidate } from "@/lib/supabase/types";

// P1.45: read-only candidate list. No status workflow in this ticket --
// status renders as a color badge only. Signed resume URLs are generated
// server-side at page load (1-hour expiry); acceptable for a low-traffic
// admin screen.

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  new: "bg-orange/10 text-orange",
  reviewing: "bg-blue-50 text-blue-700",
  contacted: "bg-green-50 text-green-700",
  closed: "bg-gray-100 text-gray-500",
};

function formatSubmitted(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export default async function AdminCandidatesPage() {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("candidates")
    .select()
    .order("created_at", { ascending: false });
  const candidates: Candidate[] = data ?? [];

  // Signed URLs expire, so they are generated fresh on every page load.
  const resumeUrls = new Map<string, string>();
  await Promise.all(
    candidates
      .filter((c) => c.resume_storage_path)
      .map(async (c) => {
        const { data: signed } = await supabase.storage
          .from("candidate-resumes")
          .createSignedUrl(c.resume_storage_path!, 3600);
        if (signed?.signedUrl) resumeUrls.set(c.id, signed.signedUrl);
      })
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink tracking-tight">
            Candidates
          </h1>
          <p className="text-sm text-muted mt-1">
            Job applications submitted through the careers form.
          </p>
        </div>
        <span className="text-sm text-muted">
          {candidates.length} application{candidates.length !== 1 ? "s" : ""}
        </span>
      </div>

      {candidates.length === 0 ? (
        <p className="text-sm text-muted py-4">No applications yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-paper border border-faint rounded-xl">
            <thead>
              <tr className="bg-soft-navy">
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Role",
                  "Experience",
                  "Resume",
                  "Submitted",
                  "Status",
                ].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-faint">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-soft-navy/40">
                  <td className="px-4 py-3 text-sm font-medium text-ink whitespace-nowrap">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <a
                      href={`mailto:${c.email}`}
                      className="text-navy underline underline-offset-2"
                    >
                      {c.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {c.phone ? (
                      <a
                        href={`tel:${c.phone}`}
                        className="text-navy underline underline-offset-2"
                      >
                        {c.phone}
                      </a>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">
                    {c.role_interest ?? <span className="text-muted">-</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted max-w-xs">
                    {c.experience_summary
                      ? truncate(c.experience_summary, 120)
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {resumeUrls.has(c.id) ? (
                      <a
                        href={resumeUrls.get(c.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy underline underline-offset-2"
                      >
                        View Resume
                      </a>
                    ) : (
                      <span className="text-muted">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                    {formatSubmitted(c.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[c.status ?? "new"] ?? statusColors.new
                      }`}
                    >
                      {c.status ?? "new"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

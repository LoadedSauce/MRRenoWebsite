"use client";

import { useState } from "react";
import { submitCandidate } from "@/app/actions/submit-candidate";

// Open-role options mirror the hiring cards on /team. "Other" lets a candidate
// apply for a role not currently listed.
const ROLE_OPTIONS = [
  "Sales Consultant",
  "Lead Carpenter",
  "Carpenter",
  "Apprentice Carpenter",
  "Lead Tile / Stone Installer",
  "Tile Installer",
  "Painter",
  "Other",
];

const RESUME_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function CandidateForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 1) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (file && file.size > RESUME_MAX_BYTES) {
      setError("Your resume file is over the 5 MB limit.");
      return;
    }

    setStatus("submitting");

    let resumeDataUrl: string | null = null;
    let resumeFilename: string | null = null;
    if (file) {
      try {
        resumeDataUrl = await readFileAsDataUrl(file);
        resumeFilename = file.name;
      } catch {
        setError("We could not read that file. Please try another.");
        setStatus("idle");
        return;
      }
    }

    const result = await submitCandidate({
      name,
      email,
      phone,
      role_interest: role,
      experience_summary: summary,
      resume_data_url: resumeDataUrl,
      resume_filename: resumeFilename,
    });

    if (result.ok) {
      setStatus("done");
    } else {
      setError(result.error);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-faint bg-paper p-8 text-center">
        <p className="font-display font-bold text-xl text-ink">
          Thanks for applying.
        </p>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          We have received your information and will be in touch if there is a
          fit. You can also call us at 763-900-2024.
        </p>
      </div>
    );
  }

  const labelClass =
    "block text-xs font-display font-semibold uppercase tracking-[0.1em] text-ink";
  const fieldClass =
    "mt-1.5 w-full rounded-md border border-faint bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-navy";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl rounded-lg border border-faint bg-paper p-6 sm:p-8 text-left"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className={labelClass}>Name</label>
          <input id="cf-name" type="text" required value={name}
            onChange={(e) => setName(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelClass}>Email</label>
          <input id="cf-email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelClass}>Phone</label>
          <input id="cf-phone" type="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="cf-role" className={labelClass}>Role of interest</label>
          <select id="cf-role" value={role}
            onChange={(e) => setRole(e.target.value)} className={fieldClass}>
            <option value="">Select a role</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="cf-summary" className={labelClass}>
          Brief experience summary
        </label>
        <textarea id="cf-summary" rows={4} value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className={`${fieldClass} resize-y`} />
      </div>

      <div className="mt-4">
        <label htmlFor="cf-resume" className={labelClass}>
          Resume (PDF or Word, up to 5 MB)
        </label>
        <input id="cf-resume" type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1.5 block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-soft-navy file:px-4 file:py-2 file:font-display file:text-sm file:font-semibold file:text-navy hover:file:bg-faint" />
      </div>

      {error ? (
        <p className="mt-3 text-sm text-orange" role="alert">{error}</p>
      ) : null}

      <button type="submit" disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-orange px-6 py-3 font-display font-semibold text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-60">
        {status === "submitting" ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}

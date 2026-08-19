import { createServiceRoleClient } from "@/lib/supabase/server";
import { TeamList } from "./team-list";
import { AddTeamMemberForm } from "./add-team-member-form";
import { TEAM_SECTIONS, type TeamMember, type TeamSection } from "@/lib/supabase/types";

export default async function AdminTeamPage() {
  const supabase = createServiceRoleClient();
  const { data: members } = await supabase
    .from("team_members")
    .select()
    .order("display_order", { ascending: true });

  const rows = (members ?? []) as TeamMember[];

  // Group by section, preserving TEAM_SECTIONS order
  const grouped: Record<TeamSection, TeamMember[]> = {
    "Owner": [],
    "Customer Service, Production & Coordination": [],
    "Sales": [],
    "Crew": [],
  };
  for (const m of rows) {
    const key = (TEAM_SECTIONS as readonly string[]).includes(m.section)
      ? (m.section as TeamSection)
      : "Crew";
    grouped[key].push(m);
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">Team</h1>
      <p className="mt-1 text-sm text-muted">
        Manage team members and photos. Assign each person to a section. Use the arrows to reorder within a section, or the section dropdown to move a person between sections.
      </p>
      <div className="mt-8">
        <AddTeamMemberForm />
      </div>

      <div className="mt-10 space-y-10">
        {TEAM_SECTIONS.map((section) => (
          <section key={section}>
            <div className="flex items-baseline justify-between border-b border-faint pb-2 mb-4">
              <h2 className="font-display font-semibold text-lg text-navy">{section}</h2>
              <span className="text-xs text-muted">
                {grouped[section].length}{" "}
                {grouped[section].length === 1 ? "member" : "members"}
              </span>
            </div>
            <TeamList members={grouped[section]} section={section} />
          </section>
        ))}
      </div>
    </div>
  );
}

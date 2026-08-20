import { createServiceRoleClient } from "@/lib/supabase/server";
import { TeamBoard } from "./team-list";
import { AddTeamMemberForm } from "./add-team-member-form";
import { type TeamMember } from "@/lib/supabase/types";

export default async function AdminTeamPage() {
  const supabase = createServiceRoleClient();
  const { data: members } = await supabase
    .from("team_members")
    .select()
    .order("section", { ascending: true })
    .order("display_order", { ascending: true });

  const rows = (members ?? []) as TeamMember[];

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">
        Team
      </h1>
      <p className="mt-1 text-sm text-muted">
        Manage team members and photos. Drag any card by the grip handle on the
        left to reorder within a section or move it into another section. The
        section dropdown and up/down arrows still work if you prefer clicks.
      </p>
      <div className="mt-8">
        <AddTeamMemberForm />
      </div>

      <div className="mt-10">
        <TeamBoard members={rows} />
      </div>
    </div>
  );
}

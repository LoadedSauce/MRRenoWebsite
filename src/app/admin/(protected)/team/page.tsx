import { createServiceRoleClient } from "@/lib/supabase/server";
import { TeamList } from "./team-list";
import { AddTeamMemberForm } from "./add-team-member-form";

export default async function AdminTeamPage() {
  const supabase = createServiceRoleClient();
  const { data: members } = await supabase
    .from("team_members")
    .select()
    .order("display_order", { ascending: true });

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">Team</h1>
      <p className="mt-1 text-sm text-muted">Manage team members and photos.</p>
      <div className="mt-8">
        <AddTeamMemberForm />
      </div>
      <div className="mt-8">
        <TeamList members={members ?? []} />
      </div>
    </div>
  );
}

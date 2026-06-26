"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export function LogoutButton() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-3 py-2 rounded-md text-sm text-white/70 hover:bg-white/10 hover:text-paper transition-colors"
    >
      Sign out
    </button>
  );
}

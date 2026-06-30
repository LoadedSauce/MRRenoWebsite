"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";

// -- TEAM MEMBERS --

export async function addTeamMember(formData: FormData) {
  const supabase = createServiceRoleClient();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const photo_url = (formData.get("photo_url") as string) || null;
  await supabase.from("team_members").insert({ name, role, photo_url, active: true });
  revalidatePath("/admin/team");
}

export async function updateTeamMember(id: string, formData: FormData) {
  const supabase = createServiceRoleClient();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const photo_url = (formData.get("photo_url") as string) || null;
  await supabase.from("team_members").update({ name, role, photo_url }).eq("id", id);
  revalidatePath("/admin/team");
}

export async function toggleTeamMember(id: string, active: boolean) {
  const supabase = createServiceRoleClient();
  await supabase.from("team_members").update({ active }).eq("id", id);
  revalidatePath("/admin/team");
}

export async function deleteTeamMember(id: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("team_members").delete().eq("id", id);
  revalidatePath("/admin/team");
}

export async function updateTeamMemberOrder(id: string, display_order: number) {
  const supabase = createServiceRoleClient();
  await supabase.from("team_members").update({ display_order }).eq("id", id);
  revalidatePath("/admin/team");
}

// -- JOB LISTINGS --

export async function addJobListing(formData: FormData) {
  const supabase = createServiceRoleClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  await supabase.from("job_listings").insert({ title, description, active: true });
  revalidatePath("/admin/jobs");
}

export async function updateJobListing(id: string, formData: FormData) {
  const supabase = createServiceRoleClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  await supabase.from("job_listings").update({ title, description }).eq("id", id);
  revalidatePath("/admin/jobs");
}

export async function toggleJobListing(id: string, active: boolean) {
  const supabase = createServiceRoleClient();
  await supabase.from("job_listings").update({ active }).eq("id", id);
  revalidatePath("/admin/jobs");
}

export async function deleteJobListing(id: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("job_listings").delete().eq("id", id);
  revalidatePath("/admin/jobs");
}

// -- PORTFOLIO ITEMS --

export async function addPortfolioItem(formData: FormData) {
  const supabase = createServiceRoleClient();
  const photo_url = formData.get("photo_url") as string;
  const caption = (formData.get("caption") as string) || null;
  const service = (formData.get("service") as string) || null;
  const city = (formData.get("city") as string) || null;
  await supabase
    .from("portfolio_items")
    .insert({ photo_url, caption, service, city, active: true });
  revalidatePath("/admin/portfolio");
}

export async function updatePortfolioItem(id: string, formData: FormData) {
  const supabase = createServiceRoleClient();
  const caption = (formData.get("caption") as string) || null;
  const service = (formData.get("service") as string) || null;
  const city = (formData.get("city") as string) || null;
  await supabase
    .from("portfolio_items")
    .update({ caption, service, city })
    .eq("id", id);
  revalidatePath("/admin/portfolio");
}

export async function togglePortfolioItem(id: string, active: boolean) {
  const supabase = createServiceRoleClient();
  await supabase.from("portfolio_items").update({ active }).eq("id", id);
  revalidatePath("/admin/portfolio");
}

export async function deletePortfolioItem(id: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("portfolio_items").delete().eq("id", id);
  revalidatePath("/admin/portfolio");
}

// -- TESTIMONIALS --

export async function addTestimonial(formData: FormData) {
  const supabase = createServiceRoleClient();
  const quote = formData.get("quote") as string;
  const author_name = formData.get("author_name") as string;
  const city = (formData.get("city") as string) || null;
  const service = (formData.get("service") as string) || null;
  await supabase
    .from("testimonials")
    .insert({ quote, author_name, city, service, active: true });
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  const supabase = createServiceRoleClient();
  const quote = formData.get("quote") as string;
  const author_name = formData.get("author_name") as string;
  const city = (formData.get("city") as string) || null;
  const service = (formData.get("service") as string) || null;
  await supabase
    .from("testimonials")
    .update({ quote, author_name, city, service })
    .eq("id", id);
  revalidatePath("/admin/testimonials");
}

export async function toggleTestimonial(id: string, active: boolean) {
  const supabase = createServiceRoleClient();
  await supabase.from("testimonials").update({ active }).eq("id", id);
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/admin/testimonials");
}

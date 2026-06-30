import { createServiceRoleClient } from "@/lib/supabase/server";
import { TestimonialList } from "./testimonial-list";
import { AddTestimonialForm } from "./add-testimonial-form";

export default async function AdminTestimonialsPage() {
  const supabase = createServiceRoleClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select()
    .order("display_order", { ascending: true });

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">
        Testimonials
      </h1>
      <p className="mt-1 text-sm text-muted">
        Tag each testimonial to a service and city so it shows up in the right places on the site. Untagged testimonials are used as generic fallbacks.
      </p>
      <div className="mt-8">
        <AddTestimonialForm />
      </div>
      <div className="mt-8">
        <TestimonialList testimonials={testimonials ?? []} />
      </div>
    </div>
  );
}

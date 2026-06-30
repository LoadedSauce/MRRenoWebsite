"use client";

import { useState } from "react";
import type { Testimonial } from "@/lib/supabase/types";
import {
  toggleTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "../../actions";

const SERVICE_OPTIONS = [
  { value: "", label: "No service tag" },
  { value: "kitchens", label: "Kitchens" },
  { value: "bathrooms", label: "Bathrooms" },
  { value: "basements", label: "Basements" },
  { value: "additions", label: "Additions" },
  { value: "whole-home", label: "Whole Home" },
  { value: "exterior", label: "Exterior" },
];

export function TestimonialList({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) {
    return (
      <p className="text-sm text-muted py-4">No testimonials yet. Add one above.</p>
    );
  }
  return (
    <div className="space-y-3">
      {testimonials.map((t) => (
        <TestimonialRow key={t.id} testimonial={t} />
      ))}
    </div>
  );
}

function TestimonialRow({ testimonial: t }: { testimonial: Testimonial }) {
  const [editing, setEditing] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this testimonial?")) return;
    await deleteTestimonial(t.id);
  }

  return (
    <div className="bg-paper rounded-lg border border-faint p-4">
      {editing ? (
        <form
          action={async (fd) => {
            await updateTestimonial(t.id, fd);
            setEditing(false);
          }}
          className="flex flex-col gap-3"
        >
          <textarea
            name="quote"
            defaultValue={t.quote}
            required
            rows={3}
            className="px-2 py-1 border border-faint rounded text-sm w-full resize-y"
          />
          <input
            name="author_name"
            defaultValue={t.author_name}
            required
            placeholder="Jane Smith, Maple Grove, MN"
            className="px-2 py-1 border border-faint rounded text-sm w-full"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="city"
              defaultValue={t.city ?? ""}
              placeholder="City (optional)"
              className="px-2 py-1 border border-faint rounded text-sm"
            />
            <select
              name="service"
              defaultValue={t.service ?? ""}
              className="px-2 py-1 border border-faint rounded text-sm"
            >
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="text-xs bg-orange text-paper px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-xs text-muted px-3 py-1 rounded border border-faint"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-ink line-clamp-2">"{t.quote}"</p>
            <p className="text-xs text-muted mt-1">{t.author_name}</p>
            <p className="text-[10px] text-muted mt-0.5">
              {[t.service, t.city].filter(Boolean).join(" -- ") || "Generic fallback"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleTestimonial(t.id, !t.active)}
              className={`text-xs px-2 py-1 rounded ${
                t.active
                  ? "bg-green-100 text-green-700"
                  : "bg-soft-navy text-muted"
              }`}
            >
              {t.active ? "Active" : "Hidden"}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-navy underline"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="text-xs text-red-600 underline">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

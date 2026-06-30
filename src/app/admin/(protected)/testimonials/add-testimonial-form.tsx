"use client";

import { addTestimonial } from "../../actions";

const SERVICE_OPTIONS = [
  { value: "", label: "No service tag" },
  { value: "kitchens", label: "Kitchens" },
  { value: "bathrooms", label: "Bathrooms" },
  { value: "basements", label: "Basements" },
  { value: "additions", label: "Additions" },
  { value: "whole-home", label: "Whole Home" },
  { value: "exterior", label: "Exterior" },
];

export function AddTestimonialForm() {
  return (
    <div className="bg-paper rounded-xl border border-faint p-6">
      <h2 className="font-display font-semibold text-base text-ink mb-4">
        Add testimonial
      </h2>
      <form action={addTestimonial} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Quote</label>
          <textarea
            name="quote"
            required
            rows={3}
            placeholder="They stayed on schedule, communicated every change, and the finished result exceeded what we had imagined."
            className="w-full px-3 py-2 border border-faint rounded-md text-sm resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Author</label>
          <input
            name="author_name"
            required
            placeholder="Jane Smith, Maple Grove, MN"
            className="w-full px-3 py-2 border border-faint rounded-md text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              City (optional)
            </label>
            <input
              name="city"
              placeholder="Maple Grove"
              className="w-full px-3 py-2 border border-faint rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Service (optional)
            </label>
            <select
              name="service"
              className="w-full px-3 py-2 border border-faint rounded-md text-sm"
            >
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-orange hover:opacity-90 text-paper font-display font-semibold text-sm px-5 py-2.5 rounded-md transition-colors"
        >
          Add testimonial
        </button>
      </form>
    </div>
  );
}

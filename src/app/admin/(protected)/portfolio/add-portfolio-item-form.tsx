"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { addPortfolioItem } from "../../actions";

const SERVICE_OPTIONS = [
  { value: "", label: "All services" },
  { value: "kitchens", label: "Kitchens" },
  { value: "bathrooms", label: "Bathrooms" },
  { value: "basements", label: "Basements" },
  { value: "additions", label: "Additions" },
  { value: "whole-home", label: "Whole Home" },
  { value: "exterior", label: "Exterior" },
];

export function AddPortfolioItemForm() {
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const ext = file.name.split(".").pop();
    const path = `portfolio/${Date.now()}.${ext}`;
    setUploading(true);
    await supabase.storage.from("media").upload(path, file);
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    setPhotoUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="bg-paper rounded-xl border border-faint p-6">
      <h2 className="font-display font-semibold text-base text-ink mb-4">Upload photo</h2>
      <form action={addPortfolioItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-ink mb-1">
            Photo file (max 2MB, web-ready)
          </label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="text-sm text-muted"
          />
          {uploading && <p className="text-xs text-muted mt-1">Uploading...</p>}
          {preview && (
            <div className="mt-2 w-24 h-24 rounded overflow-hidden bg-soft-navy relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="object-cover w-full h-full" />
            </div>
          )}
          <input type="hidden" name="photo_url" value={photoUrl} />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Caption</label>
          <input
            name="caption"
            placeholder="White shaker cabinets with quartz countertops"
            className="w-full px-3 py-2 border border-faint rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Service</label>
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

        <div>
          <label className="block text-sm font-medium text-ink mb-1">City</label>
          <input
            name="city"
            placeholder="Maple Grove"
            className="w-full px-3 py-2 border border-faint rounded-md text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={!photoUrl || uploading}
            className="bg-orange hover:opacity-90 text-paper font-display font-semibold text-sm px-5 py-2.5 rounded-md transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Add photo"}
          </button>
        </div>
      </form>
    </div>
  );
}

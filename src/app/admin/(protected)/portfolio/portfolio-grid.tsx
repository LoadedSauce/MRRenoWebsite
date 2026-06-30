"use client";

import Image from "next/image";
import { useState } from "react";
import type { PortfolioItem } from "@/lib/supabase/types";
import {
  togglePortfolioItem,
  deletePortfolioItem,
  updatePortfolioItem,
} from "../../actions";

const SERVICE_OPTIONS = [
  { value: "", label: "All services" },
  { value: "kitchens", label: "Kitchens" },
  { value: "bathrooms", label: "Bathrooms" },
  { value: "basements", label: "Basements" },
  { value: "additions", label: "Additions" },
  { value: "whole-home", label: "Whole Home" },
  { value: "exterior", label: "Exterior" },
];

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted py-4">No photos yet. Upload one above.</p>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <PortfolioItemCell key={item.id} item={item} />
      ))}
    </div>
  );
}

function PortfolioItemCell({ item }: { item: PortfolioItem }) {
  const [editing, setEditing] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this photo?")) return;
    await deletePortfolioItem(item.id);
  }

  return (
    <div
      className={`rounded-lg overflow-hidden border ${
        item.active ? "border-faint" : "border-dashed border-muted/40 opacity-60"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-soft-navy">
        <Image
          src={item.photo_url}
          alt={item.caption ?? "Portfolio photo"}
          fill
          sizes="(min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
        <span
          className={`absolute top-2 right-2 text-[10px] font-display font-semibold px-2 py-0.5 rounded ${
            item.active
              ? "bg-green-100 text-green-700"
              : "bg-soft-navy text-muted"
          }`}
        >
          {item.active ? "Live" : "Hidden"}
        </span>
      </div>

      {/* Info + actions */}
      <div className="p-3 bg-paper">
        {editing ? (
          <form
            action={async (fd) => {
              await updatePortfolioItem(item.id, fd);
              setEditing(false);
            }}
            className="space-y-2"
          >
            <input
              name="caption"
              defaultValue={item.caption ?? ""}
              placeholder="Caption"
              className="w-full px-2 py-1 border border-faint rounded text-xs"
            />
            <select
              name="service"
              defaultValue={item.service ?? ""}
              className="w-full px-2 py-1 border border-faint rounded text-xs"
            >
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              name="city"
              defaultValue={item.city ?? ""}
              placeholder="City (e.g. Maple Grove)"
              className="w-full px-2 py-1 border border-faint rounded text-xs"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="text-xs bg-orange text-paper px-2 py-1 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-xs text-muted px-2 py-1 rounded border border-faint"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-xs font-medium text-ink truncate">
              {item.caption ?? "no caption"}
            </p>
            <p className="text-[10px] text-muted mt-0.5">
              {[item.service, item.city].filter(Boolean).join(" -- ") || "Untagged"}
            </p>
          </>
        )}

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => togglePortfolioItem(item.id, !item.active)}
            className="text-[10px] text-navy underline"
          >
            {item.active ? "Hide" : "Show"}
          </button>
          <button
            onClick={() => setEditing(true)}
            className="text-[10px] text-navy underline"
          >
            Edit
          </button>
          <button onClick={handleDelete} className="text-[10px] text-red-600 underline">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

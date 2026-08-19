"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import {
  MAX_FEATURED_PORTFOLIO_ITEMS,
  type PortfolioItem,
} from "@/lib/supabase/types";
import {
  togglePortfolioItem,
  deletePortfolioItem,
  updatePortfolioItem,
  setPortfolioItemFeatured,
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
  const featuredCount = items.filter((i) => i.featured && i.active).length;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <PortfolioItemCell
          key={item.id}
          item={item}
          featuredCount={featuredCount}
        />
      ))}
    </div>
  );
}

function PortfolioItemCell({
  item,
  featuredCount,
}: {
  item: PortfolioItem;
  featuredCount: number;
}) {
  const [editing, setEditing] = useState(false);
  const [featureError, setFeatureError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleDelete() {
    if (!window.confirm("Delete this photo?")) return;
    await deletePortfolioItem(item.id);
  }

  async function handleFeatureToggle() {
    setFeatureError(null);
    const next = !item.featured;
    // Client-side pre-check for a friendlier message; server enforces truth.
    if (
      next &&
      !item.featured &&
      featuredCount >= MAX_FEATURED_PORTFOLIO_ITEMS
    ) {
      setFeatureError(
        `Already at ${MAX_FEATURED_PORTFOLIO_ITEMS}. Un-star another photo first.`
      );
      return;
    }
    if (next && !item.active) {
      setFeatureError("Show this photo before featuring it.");
      return;
    }
    startTransition(async () => {
      const res = await setPortfolioItemFeatured(item.id, next);
      if (!res.ok) {
        if (res.reason === "cap") {
          setFeatureError(
            `Already at ${MAX_FEATURED_PORTFOLIO_ITEMS}. Un-star another photo first.`
          );
        } else if (res.reason === "not_active") {
          setFeatureError("Show this photo before featuring it.");
        } else {
          setFeatureError("Could not update. Try again.");
        }
      }
    });
  }

  return (
    <div
      className={`rounded-lg overflow-hidden border ${
        item.active ? "border-faint" : "border-dashed border-muted/40 opacity-60"
      } ${item.featured && item.active ? "ring-2 ring-orange" : ""}`}
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

        {/* Featured star */}
        <button
          type="button"
          onClick={handleFeatureToggle}
          aria-label={
            item.featured ? "Un-feature from homepage" : "Feature on homepage"
          }
          aria-pressed={item.featured}
          title={
            item.featured
              ? "Featured on homepage. Click to remove."
              : "Feature on homepage"
          }
          className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition ${
            item.featured
              ? "bg-orange text-paper"
              : "bg-paper/90 text-muted hover:text-orange"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={item.featured ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>

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
              {[item.service, item.city].filter(Boolean).join(" / ") || "Untagged"}
            </p>
          </>
        )}

        {featureError && (
          <p className="text-[10px] text-red-600 mt-1">{featureError}</p>
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

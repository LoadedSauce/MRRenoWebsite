import Link from "next/link";

const cards = [
  {
    label: "Team",
    href: "/admin/team",
    description:
      "See all current team members with their photos. Add a new member, edit a name or role, swap a photo, reorder, or remove someone who has left.",
    color: "border-orange",
  },
  {
    label: "Project Photos",
    href: "/admin/portfolio",
    description:
      "Photo grid of all portfolio items. Upload a new project photo, add a caption, tag it to a service and a city. Toggle any photo on or off without deleting it.",
    color: "border-navy",
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    description:
      "List of all testimonials with on/off toggle. Add a new one, edit the quote or attribution, assign it to a service and city so it shows up in the right places on the site.",
    color: "border-orange",
  },
  {
    label: "Now Hiring",
    href: "/admin/jobs",
    description:
      "List of open positions. Add a new listing with a title and description, toggle it active or inactive, delete it when filled. Whatever is active shows up on the site automatically.",
    color: "border-navy",
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Choose a section to manage.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`block rounded-xl bg-paper border-l-4 ${card.color} p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <p className="font-display font-bold text-lg text-ink">{card.label}</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions/submit-lead";
import { readAttribution } from "@/lib/attribution";

const steps = [
  { id: 1, label: "Project" },
  { id: 2, label: "Details" },
  { id: 3, label: "Contact" },
];

const services = [
  "Kitchen Remodel",
  "Bathroom Remodel",
  "Basement Finishing",
  "Home Addition",
  "Whole-Home Renovation",
  "Exterior Renovation",
];

const timelines = [
  "Within 3 months",
  "3 to 6 months",
  "6 to 12 months",
  "Just exploring",
];

const budgets = [
  "Under $25K",
  "$25K \u2013 $75K",
  "$75K \u2013 $150K",
  "$150K+",
  "Not sure yet",
];

const contactPrefs = ["Phone", "Email", "Either is fine"];

function packDetails(opts: {
  timeline: string;
  budget: string;
  notes: string;
}): string | null {
  const lines: string[] = [];
  if (opts.timeline) lines.push(`Timeline: ${opts.timeline}`);
  if (opts.budget) lines.push(`Budget: ${opts.budget}`);
  if (opts.notes) lines.push("", opts.notes);
  return lines.length > 0 ? lines.join("\n") : null;
}

export function LeadFormShell() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferred, setPreferred] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const reset = () => {
    setStep(1);
    setService("");
    setTimeline("");
    setBudget("");
    setName("");
    setEmail("");
    setPhone("");
    setPreferred("");
    setNotes("");
    setSubmitted(false);
    setErrorMsg(null);
  };

  const handleSubmit = () => {
    setErrorMsg(null);
    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg("Please provide an email or phone number so we can reach you.");
      return;
    }
    const attribution = readAttribution();
    startTransition(async () => {
      const result = await submitLead({
        form_type: "consultation",
        full_name: name,
        email: email || null,
        phone: phone || null,
        project_type: service || null,
        project_details: packDetails({ timeline, budget, notes }),
        preferred_contact: preferred || null,
        ...attribution,
      });
      if (result.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(result.error ?? "Submission failed. Please try again.");
      }
    });
  };

  const fieldBase =
    "w-full rounded-md border border-faint bg-paper px-4 py-3 text-base text-ink placeholder:text-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-orange/40 transition-colors";
  const labelBase = "block text-sm font-display font-semibold text-ink mb-2";
  const helpBase = "mt-1.5 text-xs text-muted";
  const optionBase =
    "flex items-center gap-3 rounded-md border border-faint bg-paper px-4 py-3 cursor-pointer hover:border-navy/40 transition-colors";
  const optionSelected = "border-navy bg-soft-navy/60";

  if (submitted) {
    return (
      <div className="rounded-xl bg-paper border border-faint shadow-md p-8 sm:p-10">
        <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
          Request received
        </p>
        <h3 className="mt-3 font-display font-bold text-2xl text-ink">
          Thanks &mdash; we&rsquo;ll be in touch shortly.
        </h3>
        <p className="mt-3 text-muted leading-relaxed">
          A member of our team will reach out within one business day to set up your free, no-gimmick estimate. If your project is time-sensitive, call us directly at{" "}
          <a href="tel:7639002024" className="text-navy font-semibold underline underline-offset-4">
            763-900-2024
          </a>
          .
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 text-sm text-navy underline underline-offset-4 hover:text-orange transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-paper border border-faint shadow-md overflow-hidden">
      <div className="bg-soft-navy/60 border-b border-faint px-6 sm:px-8 py-4">
        <ol className="flex items-center justify-between gap-2">
          {steps.map((s, idx) => {
            const isActive = s.id === step;
            const isComplete = s.id < step;
            return (
              <li key={s.id} className="flex-1 flex items-center gap-2 min-w-0">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-display font-semibold transition-colors shrink-0 ${
                    isComplete
                      ? "bg-navy text-paper"
                      : isActive
                      ? "bg-orange text-paper"
                      : "bg-paper text-muted border border-faint"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {s.id}
                </span>
                <span
                  className={`hidden sm:inline text-xs font-display font-semibold uppercase tracking-[0.08em] truncate ${
                    isActive || isComplete ? "text-ink" : "text-muted"
                  }`}
                >
                  {s.label}
                </span>
                {idx < steps.length - 1 ? (
                  <span
                    className={`flex-1 h-px ml-1 ${
                      isComplete ? "bg-navy" : "bg-faint"
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="p-6 sm:p-8">
        {step === 1 ? (
          <div>
            <h3 className="font-display font-bold text-xl text-ink">
              What kind of project are you planning?
            </h3>
            <p className={`${helpBase} mb-5`}>Select one to get started.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {services.map((s) => {
                const selected = service === s;
                return (
                  <label
                    key={s}
                    className={`${optionBase} ${selected ? optionSelected : ""}`}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={s}
                      checked={selected}
                      onChange={() => setService(s)}
                      className="accent-orange"
                    />
                    <span className="text-sm font-medium text-ink">{s}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-xl text-ink">
                Timeline and budget
              </h3>
              <p className={`${helpBase} mb-5`}>
                Rough estimates are fine. This helps us match the right team to your project.
              </p>
            </div>

            <div>
              <p className={labelBase}>When would you like to start?</p>
              <div className="grid grid-cols-2 gap-2.5">
                {timelines.map((t) => {
                  const selected = timeline === t;
                  return (
                    <label
                      key={t}
                      className={`${optionBase} ${selected ? optionSelected : ""}`}
                    >
                      <input
                        type="radio"
                        name="timeline"
                        value={t}
                        checked={selected}
                        onChange={() => setTimeline(t)}
                        className="accent-orange"
                      />
                      <span className="text-sm font-medium text-ink">{t}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <p className={labelBase}>Approximate budget range</p>
              <div className="grid grid-cols-2 gap-2.5">
                {budgets.map((b) => {
                  const selected = budget === b;
                  return (
                    <label
                      key={b}
                      className={`${optionBase} ${selected ? optionSelected : ""}`}
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={b}
                        checked={selected}
                        onChange={() => setBudget(b)}
                        className="accent-orange"
                      />
                      <span className="text-sm font-medium text-ink">{b}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <div>
              <h3 className="font-display font-bold text-xl text-ink">
                Where should we send the estimate?
              </h3>
              <p className={`${helpBase} mb-5`}>
                We&rsquo;ll reach out within one business day. No spam, no high-pressure follow-up.
              </p>
            </div>

            <div>
              <label htmlFor="name" className={labelBase}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldBase}
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className={labelBase}>Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldBase}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelBase}>Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={fieldBase}
                  placeholder="(763) 555-0100"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <p className={labelBase}>Preferred contact method</p>
              <div className="grid grid-cols-3 gap-2.5">
                {contactPrefs.map((c) => {
                  const selected = preferred === c;
                  return (
                    <label
                      key={c}
                      className={`${optionBase} ${selected ? optionSelected : ""}`}
                    >
                      <input
                        type="radio"
                        name="preferred"
                        value={c}
                        checked={selected}
                        onChange={() => setPreferred(c)}
                        className="accent-orange"
                      />
                      <span className="text-sm font-medium text-ink">{c}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className={labelBase}>Anything else we should know?</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={fieldBase}
                placeholder="Optional &mdash; scope, ideas, photos to share"
              />
            </div>

            <div className="rounded-md bg-soft-navy/60 border border-faint p-4">
              <p className="text-xs font-display font-semibold uppercase tracking-[0.08em] text-navy mb-2">Review</p>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-muted text-xs">Project</dt>
                  <dd className="text-ink font-medium">{service || "Not selected"}</dd>
                </div>
                <div>
                  <dt className="text-muted text-xs">Timeline</dt>
                  <dd className="text-ink font-medium">{timeline || "Not selected"}</dd>
                </div>
                <div>
                  <dt className="text-muted text-xs">Budget</dt>
                  <dd className="text-ink font-medium">{budget || "Not selected"}</dd>
                </div>
              </dl>
            </div>

            {errorMsg ? (
              <div
                role="alert"
                className="rounded-md border border-orange/40 bg-soft-orange/60 px-4 py-3 text-sm text-ink"
              >
                {errorMsg}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-faint pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || isPending}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-md font-display font-semibold text-sm text-navy border border-faint hover:bg-soft-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          {step < steps.length ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center justify-center bg-navy hover:bg-navy-deep text-paper font-display font-semibold text-sm px-6 py-2.5 rounded-md transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              aria-busy={isPending}
              className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold text-sm px-6 py-2.5 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Sending\u2026" : "Request my estimate"}
            </button>
          )}
        </div>

        <p className="mt-4 text-xs text-muted">
          By submitting you agree to be contacted about your project. We will never sell your information.
        </p>
      </div>
    </div>
  );
}

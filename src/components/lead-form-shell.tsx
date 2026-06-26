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

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

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
  // Split name
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferred, setPreferred] = useState("");
  const [notes, setNotes] = useState("");
  // FORM-PHOTOS: optional photo files
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  // Address
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

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
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPreferred("");
    setNotes("");
    setStreetAddress("");
    setCity("");
    setState("");
    setZip("");
    setSubmitted(false);
    setErrorMsg(null);
    setPhotoFiles([]);
    setPhotoError(null);
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!firstName.trim()) {
      setErrorMsg("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setErrorMsg("Please enter your last name.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg("Please provide an email or phone number so we can reach you.");
      return;
    }
    if (!streetAddress.trim()) {
      setErrorMsg("Please enter your street address so we can schedule the site visit.");
      return;
    }
    if (!city.trim()) {
      setErrorMsg("Please enter your city.");
      return;
    }
    if (!state) {
      setErrorMsg("Please select your state.");
      return;
    }
    if (!zip.trim()) {
      setErrorMsg("Please enter your ZIP code.");
      return;
    }

    const attribution = readAttribution();

    // Encode photos as base64 data URLs for server action
    let photoDataUrls: string[] = [];
    let photoFilenames: string[] = [];
    if (photoFiles.length > 0) {
      const encodeFile = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      try {
        photoDataUrls = await Promise.all(photoFiles.map(encodeFile));
        photoFilenames = photoFiles.map((f) => f.name);
      } catch {
        // Non-fatal -- submit without photos if encoding fails
        photoDataUrls = [];
        photoFilenames = [];
      }
    }
    startTransition(async () => {
      const result = await submitLead({
        form_type: "consultation",
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        project_type: service || null,
        project_details: packDetails({ timeline, budget, notes }),
        preferred_contact: preferred || null,
        street_address: streetAddress,
        city,
        state,
        zip,
        ...attribution,
        photo_data_urls: photoDataUrls.length > 0 ? photoDataUrls : null,
        photo_filenames: photoFilenames.length > 0 ? photoFilenames : null,
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

            {/* Name — split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className={labelBase}>
                  First name <span className="text-orange">*</span>
                </label>
                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={fieldBase}
                  placeholder="Jane"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div>
                <label htmlFor="last-name" className={labelBase}>
                  Last name <span className="text-orange">*</span>
                </label>
                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={fieldBase}
                  placeholder="Doe"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            {/* Contact */}
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

            {/* Address — required on consultation */}
            <div>
              <label htmlFor="street-address" className={labelBase}>
                Street address <span className="text-orange">*</span>
              </label>
              <input
                id="street-address"
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className={fieldBase}
                placeholder="123 Maple St"
                autoComplete="street-address"
                required
              />
              <p className={helpBase}>Needed to schedule the site visit.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-2 sm:col-span-2">
                <label htmlFor="city" className={labelBase}>
                  City <span className="text-orange">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={fieldBase}
                  placeholder="Maple Grove"
                  autoComplete="address-level2"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className={labelBase}>
                  State <span className="text-orange">*</span>
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`${fieldBase} appearance-none`}
                  autoComplete="address-level1"
                  required
                >
                  <option value="">—</option>
                  {US_STATES.map((abbr) => (
                    <option key={abbr} value={abbr}>
                      {abbr}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="zip" className={labelBase}>
                  ZIP <span className="text-orange">*</span>
                </label>
                <input
                  id="zip"
                  type="text"
                  inputMode="numeric"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className={fieldBase}
                  placeholder="55369"
                  autoComplete="postal-code"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Preferred contact */}
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
                placeholder="Optional -- scope, ideas, photos to share"
              />
            </div>

            {/* FORM-PHOTOS: optional photo upload */}
            <div>
              <label htmlFor="photos" className={labelBase}>
                Photos of your space <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                id="photos"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                multiple
                className="block w-full text-sm text-muted file:mr-3 file:py-2 file:px-3 file:rounded-md file:border file:border-faint file:text-sm file:font-display file:font-semibold file:text-navy file:bg-soft-navy/40 hover:file:bg-soft-navy transition-colors"
                onChange={(e) => {
                  setPhotoError(null);
                  const files = Array.from(e.target.files ?? []);
                  const tooLarge = files.find((f) => f.size > 10 * 1024 * 1024);
                  if (tooLarge) {
                    setPhotoError("That file is too large. Please keep photos under 10MB each.");
                    e.target.value = "";
                    setPhotoFiles([]);
                    return;
                  }
                  const capped = files.slice(0, 5);
                  setPhotoFiles(capped);
                }}
              />
              <p className={helpBase}>
                Help us understand your project before the discovery visit. JPG, PNG, or HEIC. Up to 5 photos.
              </p>
              {photoError && (
                <p className="mt-1.5 text-xs text-red-600">{photoError}</p>
              )}
              {photoFiles.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {photoFiles.map((f) => (
                    <li key={f.name} className="text-xs text-muted flex items-center gap-1.5">
                      <span aria-hidden="true" className="text-orange">&#9679;</span>
                      {f.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Review card */}
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
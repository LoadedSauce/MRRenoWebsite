"use client";

import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions/submit-lead";
import { readAttribution } from "@/lib/attribution";

const contactPrefs = ["Phone", "Email", "Either is fine"];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferred, setPreferred] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPreferred("");
    setMessage("");
    setSubmitted(false);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        form_type: "contact",
        full_name: name,
        email: email || null,
        phone: phone || null,
        project_details: message || null,
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

  if (submitted) {
    return (
      <div className="rounded-xl bg-paper border border-faint shadow-md p-8 sm:p-10">
        <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
          Message received
        </p>
        <h3 className="mt-3 font-display font-bold text-2xl text-ink">
          Thanks for reaching out.
        </h3>
        <p className="mt-3 text-muted leading-relaxed">
          We&rsquo;ll get back to you within one business day. For time-sensitive matters, call{" "}
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
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-paper border border-faint shadow-md p-6 sm:p-8 space-y-5"
      noValidate
    >
      <div>
        <label htmlFor="cf-name" className={labelBase}>
          Full name
        </label>
        <input
          id="cf-name"
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
          <label htmlFor="cf-email" className={labelBase}>
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldBase}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelBase}>
            Phone
          </label>
          <input
            id="cf-phone"
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
                className={`flex items-center gap-3 rounded-md border bg-paper px-3 py-2.5 cursor-pointer transition-colors ${
                  selected
                    ? "border-navy bg-soft-navy/60"
                    : "border-faint hover:border-navy/40"
                }`}
              >
                <input
                  type="radio"
                  name="cf-preferred"
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
        <label htmlFor="cf-message" className={labelBase}>
          How can we help?
        </label>
        <textarea
          id="cf-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className={fieldBase}
          placeholder="Tell us a little about your project, question, or what you need."
        />
      </div>

      {errorMsg ? (
        <div
          role="alert"
          className="rounded-md border border-orange/40 bg-soft-orange/60 px-4 py-3 text-sm text-ink"
        >
          {errorMsg}
        </div>
      ) : null}

      <div className="flex items-center justify-end pt-2 border-t border-faint">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold text-sm px-6 py-3 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Sending\u2026" : "Send message"}
        </button>
      </div>

      <p className="text-xs text-muted">
        By submitting you agree to be contacted about your inquiry. We will never sell your information.
      </p>
    </form>
  );
}

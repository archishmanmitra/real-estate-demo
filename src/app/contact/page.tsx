"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, motionSafe } from "@/lib/gsap";
import { Footer } from "../_components/footer/Footer";

const INTERESTS = ["Apartments", "Villas", "Plots", "Commercial"] as const;

export default function ContactPage() {
  const mainRef = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  useGSAP(
    () => {
      if (!motionSafe()) return;
      const split = SplitText.create(".contact-title", { type: "chars", mask: "lines" });
      gsap.from(split.chars, {
        yPercent: 100,
        stagger: 0.025,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.4,
      });
      gsap.from(".contact-field", {
        opacity: 0,
        y: 14,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.7,
      });
      return () => split.revert();
    },
    { scope: mainRef }
  );

  return (
    <main ref={mainRef} style={{ backgroundColor: "#0C0C0E", minHeight: "100vh" }}>
      <style>{`
        .field-input {
          font-family: var(--font-body);
          font-weight: 300;
          font-size: 0.95rem;
          color: #FAFAF8;
          width: 100%;
          padding: 0.85rem 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(200,184,154,0.35);
          outline: none;
          border-radius: 0;
          transition: border-color 0.25s ease;
        }
        .field-input::placeholder { color: rgba(107,114,128,0.8); }
        .field-input:focus { border-bottom-color: #D4873A; }
        select.field-input { appearance: none; cursor: pointer; }
        select.field-input option { background: #0C0C0E; }
        .submit-btn {
          font-family: var(--font-body);
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          color: #D4873A;
          border: 1px solid #D4873A;
          background: transparent;
          padding: 0.8rem 2.5rem;
          border-radius: 0;
          cursor: pointer;
          transition: background-color 0.28s ease, color 0.28s ease;
        }
        .submit-btn:hover { background-color: #D4873A; color: #0C0C0E; }
      `}</style>

      <section
        style={{
          paddingTop: "clamp(9rem,20vh,13rem)",
          paddingLeft: "clamp(1.5rem,5vw,5rem)",
          paddingRight: "clamp(1.5rem,5vw,5rem)",
          paddingBottom: "clamp(4rem,10vh,8rem)",
        }}
      >
        <div
          className="flex flex-col lg:flex-row"
          style={{ maxWidth: "1400px", margin: "0 auto", gap: "clamp(3rem,6vw,6rem)" }}
        >
          {/* ── Left — heading ─────────────────────────────────────────── */}
          <div style={{ flex: "1 1 45%" }}>
            <p
              className="contact-field"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: "#C8B89A",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              /Contact — We respond within 4 business hours
            </p>
            <h1
              className="contact-title"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem,7vw,6rem)",
                fontWeight: 300,
                color: "#FAFAF8",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Start the conversation.
            </h1>
          </div>

          {/* ── Right — form ───────────────────────────────────────────── */}
          <div style={{ flex: "1 1 55%", paddingTop: "0.5rem" }}>
            {sent ? (
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "#C8B89A",
                  lineHeight: 1.5,
                }}
              >
                Thank you. Our team will reach you within 4 business hours.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="flex flex-col"
                style={{ gap: "1.75rem" }}
              >
                <div className="contact-field">
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input id="name" name="name" required className="field-input" placeholder="Full Name" />
                </div>
                <div className="contact-field">
                  <label htmlFor="phone" className="sr-only">Phone</label>
                  <input id="phone" name="phone" type="tel" required className="field-input" placeholder="Phone" />
                </div>
                <div className="contact-field">
                  <label htmlFor="city" className="sr-only">City</label>
                  <input id="city" name="city" required className="field-input" placeholder="City" />
                </div>
                <div className="contact-field">
                  <label
                    htmlFor="interest"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(200,184,154,0.6)",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    I&apos;m interested in
                  </label>
                  <select id="interest" name="interest" className="field-input" defaultValue={INTERESTS[0]}>
                    {INTERESTS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="contact-field">
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea id="message" name="message" rows={4} className="field-input" placeholder="Message" />
                </div>

                <div className="contact-field" style={{ marginTop: "0.5rem" }}>
                  <button type="submit" className="submit-btn">
                    Send Enquiry →
                  </button>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "0.75rem",
                      color: "#6B7280",
                      marginTop: "1rem",
                    }}
                  >
                    Our team responds within 4 business hours.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

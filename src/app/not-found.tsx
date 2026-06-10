import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="flex flex-col items-center justify-center text-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#0C0C0E",
        padding: "2rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "#D4873A",
          textTransform: "uppercase",
          marginBottom: "1.25rem",
        }}
      >
        /404
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem,6vw,5rem)",
          fontWeight: 300,
          color: "#FAFAF8",
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        This address doesn&apos;t exist yet.
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 300,
          fontSize: "0.95rem",
          color: "#6B7280",
          marginTop: "1.25rem",
        }}
      >
        But we might have something nearby.
      </p>
      <Link
        href="/properties"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#D4873A",
          textDecoration: "none",
          marginTop: "2rem",
          border: "1px solid #D4873A",
          padding: "0.7rem 1.8rem",
        }}
      >
        → Back to Properties
      </Link>
    </main>
  );
}

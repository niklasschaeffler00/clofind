import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: 16, lineHeight: 1.5 }}>
      <h1>Willkommen bei CloFind 👕</h1>
      <p>Finde ähnliche Outfits durch Bild-Upload.</p>

      <Link
        href="/upload"
        style={{
          display: "inline-block",
          marginTop: 20,
          padding: "10px 16px",
          background: "#111827",
          color: "white",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        ➡️ Zur Upload-Seite
      </Link>
    </main>
  );
}


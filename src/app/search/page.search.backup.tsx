"use client";
import { useState } from "react";

type Hit = {
  product_id: number;
  score: number;
  label: string;
  title: string | null;
  price: number;
  currency: string | null;
  merchant: string | null;
  deeplink: string | null;
  image_url: string | null;
};

type SearchResponse = { results?: Hit[] };

export default function SearchPage() {
  const [url, setUrl] = useState("https://picsum.photos/seed/999/600/800.jpg");
  const [file, setFile] = useState<File | null>(null);
  const [topk, setTopk] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Hit[]>([]);

  // Debug optional:
  // if (typeof window !== "undefined") {
  //   console.log("API_BASE:", process.env.NEXT_PUBLIC_API_BASE);
  // }

  const runSearchByUrl = async (): Promise<SearchResponse> => {
    const form = new URLSearchParams();
    form.set("image_url", url);
    form.set("topk", String(topk));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/search/by-url`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`${res.status} ${res.statusText} – ${txt}`);
    }
    return res.json();
  };

const runSearchByUpload = async (): Promise<SearchResponse> => {
  if (!file) throw new Error("Bitte zuerst eine Bilddatei auswählen.");

  const form = new FormData();
  form.set("file", file);
  form.set("topk", String(topk));

  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE fehlt.");

  const candidates = ["/search/by-upload", "/search/image"]; // Fallback-Reihenfolge

  let lastText = "";
  for (const path of candidates) {
    const res = await fetch(`${base}${path}`, { method: "POST", body: form });
    if (res.ok) {
      return res.json();
    }
    // wenn 404: nächsten Kandidaten probieren
    lastText = await res.text().catch(() => "");
    if (res.status !== 404) {
      throw new Error(`${res.status} ${res.statusText} – ${lastText}`);
    }
  }

  throw new Error(`Kein Upload-Endpoint gefunden (404). Letzte Antwort: ${lastText}`);
};


  const handleSubmitUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResults([]);
    try {
      const data = await runSearchByUrl();
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Fehler bei der URL-Suche");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResults([]);
    try {
      const data = await runSearchByUpload();
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Fehler bei der Upload-Suche");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Visuelle Suche</h1>

      {/* --- Suche per Bild-URL --- */}
      <section className="space-y-3 rounded-2xl border p-4">
        <h2 className="font-medium">Suche per URL</h2>
        <form onSubmit={handleSubmitUrl} className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium">Bild-URL</span>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              required
            />
          </label>

          <div className="flex items-end gap-4">
            <label className="block">
              <span className="text-sm font-medium">Top-K</span>
              <input
                className="mt-1 w-24 rounded-xl border px-3 py-2"
                type="number"
                min={1}
                max={50}
                value={topk}
                onChange={(e) => setTopk(Number(e.target.value))}
              />
            </label>

            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Suche…" : "Suchen"}
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Tipp: <code>https://picsum.photos/seed/999/600/800.jpg</code>
          </p>
        </form>
      </section>

      {/* --- Suche per Upload --- */}
      <section className="space-y-3 rounded-2xl border p-4">
        <h2 className="font-medium">Suche per Datei-Upload</h2>
        <form onSubmit={handleSubmitUpload} className="space-y-3">
          <input
            className="rounded-xl border px-3 py-2"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <div>
            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Suche…" : "Hochladen & Suchen"}
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-500">
          Unterstützt: JPG/PNG/WebP. Dateien &lt; 8–10 MB sind ideal.
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!!results.length && (
        <ul className="grid gap-4">
          {results.map((r) => (
            <li key={r.product_id} className="flex gap-4 rounded-2xl border p-4">
              {r.image_url ? (
                // Hinweis: <img> erzeugt nur eine Lint-Warnung, kein Build-Fehler
                <img
                  src={r.image_url}
                  alt={r.title ?? `Produkt ${r.product_id}`}
                  className="h-28 w-20 rounded-lg object-cover"
                />
              ) : (
                <div className="h-28 w-20 rounded-lg bg-gray-200" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium">{r.title ?? `Produkt ${r.product_id}`}</h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      r.label === "Exact"
                        ? "bg-emerald-100 text-emerald-700"
                        : r.label === "Sehr ähnlich"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {r.label}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {r.merchant ? `${r.merchant} • ` : ""}
                  {typeof r.price === "number" ? r.price.toFixed(2) : r.price} {r.currency ?? ""}
                </div>
                <div className="mt-2 text-sm text-gray-500">Score: {r.score.toFixed(3)}</div>
                {r.deeplink && (
                  <a
                    href={r.deeplink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Zum Shop
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && results.length === 0 && (
        <p className="text-sm text-gray-500">
          Noch keine Ergebnisse. Suche per URL oder lade ein Foto hoch.
        </p>
      )}
    </main>
  );
}

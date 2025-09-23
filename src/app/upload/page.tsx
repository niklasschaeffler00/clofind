'use client';
import { useState } from 'react';

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

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [topk, setTopk] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Hit[]>([]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    setResults([]);
    setError(null);
  }

  const runSearchByUpload = async (): Promise<SearchResponse> => {
    if (!file) throw new Error('Bitte zuerst eine Bilddatei auswählen.');

    const form = new FormData();
    form.set('file', file);
    form.set('topk', String(topk));

    const base = process.env.NEXT_PUBLIC_API_BASE;
    if (!base) throw new Error('NEXT_PUBLIC_API_BASE fehlt.');

    // gleiche Fallback-Reihenfolge wie in /search
    const candidates = ['/search/by-upload', '/search/image'];

    let lastText = '';
    for (const path of candidates) {
      const res = await fetch(`${base}${path}`, { method: 'POST', body: form });
      if (res.ok) return res.json();
      lastText = await res.text().catch(() => '');
      if (res.status !== 404) {
        throw new Error(`${res.status} ${res.statusText} – ${lastText}`);
      }
    }
    throw new Error(`Kein Upload-Endpoint gefunden (404). Letzte Antwort: ${lastText}`);
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
      setError(msg || 'Fehler bei der Upload-Suche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Bild-Upload</h1>
      <p className="text-gray-600">Wähle ein Bild aus und klicke auf „Suchen“.</p>

      <section className="space-y-3 rounded-2xl border p-4">
        <form onSubmit={handleSubmitUpload} className="space-y-3">
          <div className="flex items-end gap-4">
            <label className="block">
              <span className="text-sm font-medium">Bilddatei</span>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                type="file"
                accept="image/*"
                onChange={onFileChange}
              />
            </label>

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
              disabled={loading || !file}
            >
              {loading ? 'Suche…' : 'Suchen'}
            </button>
          </div>

          {previewUrl && (
            <div className="mt-2">
              <div className="text-sm text-gray-600 font-medium">Vorschau</div>
              {/* <img> ist okay – Next/Image ist optional */}
              <img
                src={previewUrl}
                alt="Vorschau"
                className="mt-1 h-64 w-auto rounded-xl object-cover"
              />
            </div>
          )}

          <p className="text-xs text-gray-500">
            Unterstützt: JPG/PNG/WebP. Dateien &lt; 8–10 MB sind ideal.
          </p>
        </form>
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
                      r.label === 'Exact'
                        ? 'bg-emerald-100 text-emerald-700'
                        : r.label === 'Sehr ähnlich'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {r.label}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {r.merchant ? `${r.merchant} • ` : ''}
                  {typeof r.price === 'number' ? r.price.toFixed(2) : r.price} {r.currency ?? ''}
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
          Noch keine Ergebnisse. Lade ein Foto hoch und starte die Suche.
        </p>
      )}
    </main>
  );
}

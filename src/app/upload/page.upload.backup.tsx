'use client';

import { useState, ChangeEvent } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const onSearch = () => {
    if (!file) {
      alert('Bitte zuerst ein Bild auswählen.');
      return;
    }
    alert(`✅ Bild empfangen: ${file.name}`);
  };

  return (
    <main style={{ maxWidth: 600, margin: '40px auto', padding: 16, lineHeight: 1.5 }}>
      <h1>Bild-Upload</h1>
      <p>Wähle ein Bild aus und klicke auf „Suchen“.</p>

      <input type="file" accept="image/*" onChange={onFileChange} />

      <div style={{ marginTop: 12 }}>
        <button onClick={onSearch} disabled={!file} style={{ padding: '8px 14px', cursor: 'pointer' }}>
          Suchen
        </button>
      </div>

      {previewUrl && (
        <div style={{ marginTop: 16 }}>
          <strong>Vorschau:</strong>
          <img
            src={previewUrl}
            alt="Vorschau"
            style={{ display: 'block', maxWidth: '100%', borderRadius: 8, marginTop: 8 }}
          />
        </div>
      )}
    </main>
  );
}

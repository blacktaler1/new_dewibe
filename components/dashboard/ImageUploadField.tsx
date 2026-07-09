"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, UploadSimple } from "@phosphor-icons/react";

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploadField({
  label = "Rasm",
  value,
  onChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | null) => {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setError(data.error || "Rasm yuklanmadi");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Rasm yuklanmadi");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="image-upload-field">
      <label className="form-label">{label}</label>

      {value && (
        <div className="image-upload-preview">
          <img src={value} alt="Preview" />
        </div>
      )}

      <div className="image-upload-actions">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="image-upload-input"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <UploadSimple size={14} weight="bold" style={{ marginRight: "0.35rem" }} />
          {uploading ? "Yuklanmoqda..." : "Rasm yuklash"}
        </button>
        <span className="image-upload-hint">JPG, PNG, WEBP, GIF · max 5MB</span>
      </div>

      <div className="image-upload-url">
        <ImageIcon size={16} weight="duotone" />
        <input
          className="form-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Yoki rasm URL kiriting"
        />
      </div>

      {error && <p className="image-upload-error">{error}</p>}
    </div>
  );
}

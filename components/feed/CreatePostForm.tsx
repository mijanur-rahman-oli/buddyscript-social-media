// components/feed/CreatePostForm.tsx
"use client";

import { useState, useTransition, useRef } from "react";
import { createPost } from "@/actions/feed.actions";

interface CreatePostFormProps {
  userImage?: string | null;
  userName?: string | null;
}

export function CreatePostForm({ userImage, userName }: CreatePostFormProps) {
  const [text, setText] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if ((!text.trim() && !imageFile)) return;
    setError(null);

    const formData = new FormData();
    formData.set("text", text);
    formData.set("visibility", visibility);
    if (imageFile) {
      formData.set("image", imageFile);
    }

    startTransition(async () => {
      try {
        await createPost(formData);
        setText("");
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch {
        setError("Failed to post. Please try again.");
      }
    });
  }

  return (
    <div className="_feed_inner_text_area _b_radious6 _feed_inner_area _mar_b16" style={{ padding: 24 }}>
      <div className="_feed_inner_text_area_box" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div className="_feed_inner_text_area_box_image">
          {userImage ? (
            <img
              src={userImage}
              alt={userName ?? "You"}
              className="_txt_img"
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div
              className="_txt_img"
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#377DFF", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 16,
              }}
            >
              {userName?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
        </div>
        <div className="_feed_inner_text_area_box_form" style={{ flex: 1, position: "relative" }}>
          <textarea
            className="form-control _textarea"
            placeholder="Write something ..."
            id="floatingTextarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isPending}
            style={{
              width: "100%",
              background: "var(--bs-input-bg)",
              border: "1px solid var(--bs-border)",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 14,
              minHeight: 80,
              resize: "vertical"
            }}
          />
          <div style={{
            position: "absolute",
            bottom: "12px",
            right: "16px",
            fontSize: "12px",
            color: "var(--bs-text-muted)",
            pointerEvents: "none"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 23 24">
              <path fill="#666" d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div style={{ position: "relative", marginTop: 12, marginBottom: 12, display: "inline-block" }}>
          <img src={imagePreview} alt="Preview" style={{ maxHeight: 150, borderRadius: 8 }} />
          <button
            type="button"
            onClick={removeImage}
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              background: "#ff4757",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 24,
              height: 24,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <p style={{ color: "#dc2626", fontSize: 13, marginTop: 8 }}>{error}</p>
      )}

      {/* Desktop Bottom Bar */}
      <div className="_feed_inner_text_area_bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div className="_feed_inner_text_area_item" style={{ display: "flex", gap: 4 }}>
          {/* Photo Button */}
          <div className="_feed_inner_text_area_bottom_photo _feed_common">
            <button
              type="button"
              className="_feed_inner_text_area_bottom_photo_link"
              onClick={() => fileInputRef.current?.click()}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--bs-text-secondary)" }}
            >
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51z" />
                </svg>
              </span>
              Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageSelect}
            />
          </div>

          {/* Video Button */}
          <div className="_feed_inner_text_area_bottom_video _feed_common">
            <button type="button" className="_feed_inner_text_area_bottom_photo_link" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--bs-text-secondary)" }}>
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <rect x="2" y="6" width="14" height="12" rx="2" stroke="#666" strokeWidth="1.5" />
                  <path d="M16 10l5.5-3v10l-5.5-3V10z" stroke="#666" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
              Video
            </button>
          </div>

          {/* Event Button */}
          <div className="_feed_inner_text_area_bottom_event _feed_common">
            <button type="button" className="_feed_inner_text_area_bottom_photo_link" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--bs-text-secondary)" }}>
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#666" strokeWidth="1.5" />
                  <path d="M3 9h18" stroke="#666" strokeWidth="1.5" />
                  <path d="M8 2v4M16 2v4" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="7" y="13" width="4" height="4" rx="1" fill="#666" />
                </svg>
              </span>
              Event
            </button>
          </div>

          {/* Article Button */}
          <div className="_feed_inner_text_area_bottom_article _feed_common">
            <button type="button" className="_feed_inner_text_area_bottom_photo_link" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--bs-text-secondary)" }}>
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <rect x="4" y="2" width="16" height="20" rx="2" stroke="#666" strokeWidth="1.5" />
                  <path d="M8 7h8M8 11h8M8 15h5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              Article
            </button>
          </div>
        </div>

        <div className="_feed_inner_text_area_btn" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "PUBLIC" | "PRIVATE")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--bs-border)",
              background: "var(--bs-input-bg)",
              fontSize: 13,
            }}
          >
            <option value="PUBLIC">🌍 Public</option>
            <option value="PRIVATE">🔒 Private</option>
          </select>
          <button
            type="button"
            className="_feed_inner_text_area_btn_link"
            onClick={handleSubmit}
            disabled={isPending || (!text.trim() && !imageFile)}
            style={{
              background: "#377DFF",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: isPending || (!text.trim() && !imageFile) ? 0.6 : 1,
            }}
          >
            <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
              <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" />
            </svg>
            <span>{isPending ? "Posting..." : "Post"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
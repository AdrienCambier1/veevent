"use client";
import { useState, useRef } from "react";
import { MediaImagePlus, Xmark } from "iconoir-react";

export default function ImagePicker({ onChange, value }) {
  const [preview, setPreview] = useState(value || "");
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    if (onChange) {
      onChange(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview("");
    if (onChange) {
      onChange(null);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt="Prévisualisation"
            className="img-picker-preview"
          />
          <button className="red-rounded-btn" onClick={handleRemove}>
            <span>Retirer l'affiche</span>
            <Xmark />
          </button>
        </>
      ) : (
        <button className="primary-form-btn" onClick={handleButtonClick}>
          <span>Ajouter une affiche</span>
          <MediaImagePlus />
        </button>
      )}
    </>
  );
}

"use client";
import { useState, useRef } from "react";
import { Trash, MediaImagePlus, Plus } from "iconoir-react";

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
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Prévisualisation"
            className="img-picker-preview"
          />
          <button
            className="img-remove-btn absolute top-2 right-2"
            onClick={handleRemove}
          >
            <Trash />
          </button>
        </div>
      ) : (
        <button className="primary-form-btn" onClick={handleButtonClick}>
          <span>Ajouter une affiche</span>
          <MediaImagePlus />
        </button>
      )}
    </div>
  );
}

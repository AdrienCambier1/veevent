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
    <div className="aspect-[16/9]">
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
            className="banner !rounded-xl"
          />
          <button
            className="img-remove-btn absolute top-2 right-2"
            onClick={handleRemove}
          >
            <span>Retirer l'image</span>
            <Trash />
          </button>
        </div>
      ) : (
        <div
          className="h-full w-full bg-white flex flex-col items-center justify-center gap-4 border border-[var(--primary-border-col)] rounded-xl p-8 text-center cursor-pointer"
          onClick={handleButtonClick}
        >
          <MediaImagePlus className="h-6 w-6 flex-shrink-0" />
          <p>
            Veuillez ajouter une affiche à votre événement afin de le publier.
          </p>
          <button type="button" className="secondary-btn">
            <span>Ajouter une affiche</span>
            <Plus />
          </button>
        </div>
      )}
    </div>
  );
}

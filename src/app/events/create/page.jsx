"use client";
import StepIndicator from "@/components/step-indicator";
import MainTitle from "@/components/titles/main-title";
import { useState } from "react";
import { ArrowLeft } from "iconoir-react";
import ImagePicker from "@/components/buttons/image-picker";
import MultiDropdownButton from "@/components/buttons/multi-dropdown-button";
import Link from "next/link";

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnail: null,
    tags: [],
    locationName: "",
    locationData: "",
    date: "",
    hour: "",
    user_limit: "",
    tickets: [],
  });

  const filterOptions = [
    { label: "Musique", value: "musique" },
    { label: "Sport", value: "sport" },
    { label: "Cinéma", value: "cinema" },
    { label: "Théâtre", value: "theatre" },
    { label: "Arts", value: "arts" },
  ];

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.name !== "" &&
          formData.description !== "" &&
          formData.thumbnail !== null
        );
      case 2:
        return (
          formData.locationName !== "" &&
          formData.locationData !== "" &&
          formData.date !== "" &&
          formData.hour !== ""
        );
      case 3:
        return formData.tickets.length > 0;
      default:
        return false;
    }
  };

  const steps = [
    {
      value: 1,
      onClick: () => setStep(1),
      disabled: false,
    },
    {
      value: 2,
      onClick: () => setStep(2),
      disabled: step === 1 && !isStepValid(),
    },
    {
      value: 3,
      onClick: () => setStep(3),
      disabled: step < 2 || (step === 2 && !isStepValid()),
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = () => {
    if (isStepValid()) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleFilterSelect = (option) => {
    const newFilters = [...selectedFilters, option.value];
    setSelectedFilters(newFilters);
    setFormData({ ...formData, tags: newFilters });
  };

  const handleFilterRemove = (value) => {
    const newFilters = selectedFilters.filter((filter) => filter !== value);
    setSelectedFilters(newFilters);
    setFormData({ ...formData, tags: newFilters });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!isStepValid()) return;

    if (step < 3) {
      handleNextStep();
    } else {
      router.push("/");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="flex flex-col gap-2">
              <label>Nom*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom de l'événement"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Descripion*</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description de l'événement"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Affiche de l'événement*</label>
              <ImagePicker
                onChange={(file) =>
                  setFormData({ ...formData, thumbnail: file })
                }
                value={
                  formData.thumbnail
                    ? URL.createObjectURL(formData.thumbnail)
                    : ""
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Tags</label>
              <MultiDropdownButton
                options={filterOptions}
                selectedValues={selectedFilters}
                label="Filtre par catégorie :"
                onSelect={handleFilterSelect}
                onRemove={handleFilterRemove}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="flex flex-col gap-2">
              <label>Date de l'événement</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="jj/mm/aaaa"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-full">
                <label>Heure de l'événement*</label>
                <input
                  type="text"
                  name="hour"
                  value={formData.hour}
                  onChange={handleChange}
                  placeholder="08:00"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Limite de participants</label>
                <input
                  type="text"
                  name="user_limit"
                  value={formData.user_limit}
                  onChange={handleChange}
                  placeholder="Aucune limite"
                />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <main>
      <section className="container items-center">
        <MainTitle title="Créer votre événement" />
        <StepIndicator currentStep={step} steps={steps} />
      </section>
      <section className="container items-center">
        <form onSubmit={handleFormSubmit}>
          {renderStep()}
          <button
            type="submit"
            disabled={!isStepValid()}
            className="primary-form-btn"
          >
            <span>Continuer</span>
          </button>
          <Link href="/" className="secondary-form-btn">
            <span>Annuler</span>
          </Link>
          {step > 1 && (
            <div className="w-full flex justify-center">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="back-form-btn"
              >
                <ArrowLeft />
              </button>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}

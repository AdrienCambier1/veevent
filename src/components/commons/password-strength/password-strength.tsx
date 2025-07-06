"use client";
import { useState, useEffect } from "react";
import { AUTH_CONFIG } from "@/config/auth.config";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface PasswordCriteria {
  label: string;
  met: boolean;
}

export function PasswordStrength({ password, className = "" }: PasswordStrengthProps) {
  const [criteria, setCriteria] = useState<PasswordCriteria[]>([]);
  const [strength, setStrength] = useState<"weak" | "medium" | "strong">("weak");

  useEffect(() => {
    const newCriteria: PasswordCriteria[] = [
      {
        label: `Au moins ${AUTH_CONFIG.SECURITY.PASSWORD_MIN_LENGTH} caractères`,
        met: password.length >= AUTH_CONFIG.SECURITY.PASSWORD_MIN_LENGTH,
      },
      {
        label: "Au moins une lettre minuscule",
        met: /[a-z]/.test(password),
      },
      {
        label: "Au moins une lettre majuscule",
        met: /[A-Z]/.test(password),
      },
      {
        label: "Au moins un chiffre",
        met: /\d/.test(password),
      },
      {
        label: "Au moins un caractère spécial",
        met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      }
    ];

    setCriteria(newCriteria);

    // Calculer la force du mot de passe
    const metCriteria = newCriteria.filter(c => c.met).length;
    if (metCriteria === 6) {
      setStrength("strong");
    } else if (metCriteria >= 4) {
      setStrength("medium");
    } else {
      setStrength("weak");
    }
  }, [password]);

  if (!password) return null;

  const getStrengthColor = () => {
    switch (strength) {
      case "weak":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "strong":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case "weak":
        return "Faible";
      case "medium":
        return "Moyen";
      case "strong":
        return "Fort";
      default:
        return "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Force du mot de passe :</span>
        <span className={`text-sm font-medium ${getStrengthColor()}`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="space-y-1">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              criterion.met ? "bg-green-500" : "bg-gray-300"
            }`}>
              {criterion.met && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`text-xs ${criterion.met ? "text-green-600" : "text-gray-500"}`}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 
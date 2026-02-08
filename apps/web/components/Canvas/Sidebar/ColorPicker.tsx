"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  showTransparent?: boolean;
}

const PRESET_COLORS = [
  { value: "#000000", label: "Black" },
  { value: "#e03131", label: "Red" },
  { value: "#2f9e44", label: "Green" },
  { value: "#1971c2", label: "Blue" },
  { value: "#f08c00", label: "Orange" },
  { value: "#e64980", label: "Pink" },
  { value: "#be4bdb", label: "Purple" },
  { value: "#0ca678", label: "Teal" },
];

export function ColorPicker({ value, onChange, label, showTransparent = false }: ColorPickerProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const isSelected = (color: string) => {
    return value.toLowerCase() === color.toLowerCase();
  };

  const isTransparent = () => {
    return value === "transparent" || value === "rgba(0,0,0,0)" || value === "#00000000";
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {showTransparent && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onChange("transparent");
            }}
            className={`
              w-10 h-10 rounded-lg border-2 transition-all relative overflow-hidden
              ${isTransparent() ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300 hover:border-gray-400"}
            `}
            title="Transparent"
          >
            <div className="absolute inset-0 bg-white">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="checkerboard" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" fill="#e5e7eb" />
                    <rect x="4" y="4" width="4" height="4" fill="#e5e7eb" />
                    <rect x="4" y="0" width="4" height="4" fill="#f9fafb" />
                    <rect x="0" y="4" width="4" height="4" fill="#f9fafb" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#checkerboard)" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
            </div>
            {isTransparent() && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-20">
                <Check size={20} className="text-blue-600" strokeWidth={3} />
              </div>
            )}
          </button>
        )}

        {PRESET_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onChange(color.value);
            }}
            className={`
              w-10 h-10 rounded-lg border-2 transition-all relative
              ${isSelected(color.value) ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300 hover:border-gray-400"}
            `}
            style={{ backgroundColor: color.value }}
            title={color.label}
          >
            {isSelected(color.value) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check 
                  size={20} 
                  className={color.value === "#000000" ? "text-white" : "text-gray-800"} 
                  strokeWidth={3} 
                />
              </div>
            )}
          </button>
        ))}

        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowCustomPicker(!showCustomPicker);
            }}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all relative overflow-hidden"
            title="Custom color"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              +
            </div>
          </button>

          {showCustomPicker && (
            <input
              type="color"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setShowCustomPicker(false);
              }}
              className="absolute top-0 left-0 w-10 h-10 opacity-0 cursor-pointer"
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Current:</span>
        <div className="flex items-center gap-1">
          <div
            className="w-4 h-4 rounded border border-gray-300"
            style={{ backgroundColor: value }}
          ></div>
          <code className="font-mono">{value}</code>
        </div>
      </div>
    </div>
  );
}
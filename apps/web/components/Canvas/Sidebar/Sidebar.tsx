"use client";

import { Element } from "@repo/engine";
import { X } from "lucide-react";
import { ColorPicker } from "./ColorPicker";
import { useRef, useEffect } from "react";

interface SidebarProps {
  selectedElement: Element | null;
  onUpdateElement: (updates: Partial<Element>) => void;
  onClose: () => void;
}

export function Sidebar({ selectedElement, onUpdateElement, onClose }: SidebarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTop = scrollPositionRef.current;

    const handleScroll = () => {
      scrollPositionRef.current = container.scrollTop;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  if (!selectedElement) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-30 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          type="button"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Shape
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-700 capitalize font-medium">
            {selectedElement.type.replace("-", " ")}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Stroke
          </label>
          <ColorPicker
            value={selectedElement.strokeColor}
            onChange={(color) => onUpdateElement({ strokeColor: color })}
            label="Stroke color"
          />
        </div>

      </div>
    </div>
  );
}
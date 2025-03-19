import React from "react";

export default function Pill({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={`rounded-full bg-gradient-to-r from-[#4135F3] to-[#BE52F2] p-[1px] ${className}`}
    >
      <p
        className="bg-brand-dark rounded-full px-5 text-[15px] leading-tight text-blue-100"
        style={{
          padding: "clamp(6px, 0.66vw, 8px) clamp(10px, 1.34vw, 20px)"
        }}
      >
        {text}
      </p>
    </div>
  );
}

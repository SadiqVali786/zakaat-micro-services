"use client";

import { PlaceholdersAndVanishInput } from "@/components/aceternityui/placeholders-and-vanish-input";

const placeholders = [
  "Search zakaat applications",
  "Search bookmarked applications",
  "Search history of donations"
];

const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("submitted");
};

export function CustomSearchbar() {
  return (
    <div className="mt-8 mb-14">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={() => {}}
        onSubmit={onSubmit}
      />
    </div>
  );
}

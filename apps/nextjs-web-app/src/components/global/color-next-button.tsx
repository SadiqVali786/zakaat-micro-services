import { cn } from "@/lib/utils";

type ColorfulNextButtonProps = {
  onClick: () => void;
  className?: string;
};

export const ColorfulNextButton = ({ onClick, className }: ColorfulNextButtonProps) => {
  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-lg border border-[#4135f3] px-4 py-2",
        className
      )}
      onClick={onClick}
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3 12c0-.55.45-1 1-1h15.5a1 1 0 110 2H4a1 1 0 01-1-1z"
          fill="#EBC9FB"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.29 19.21a1 1 0 010-1.42L19.08 12l-5.79-5.79a1 1 0 111.42-1.42l5.79 5.79a2 2 0 010 2.83l-5.79 5.79a1 1 0 01-1.42 0z"
          fill="#4135F3"
        />
      </svg>
      <span className="text-lg font-bold text-[#b5b2ff]">Next</span>
    </button>
  );
};

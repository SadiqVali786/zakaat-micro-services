import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const BlackAndWhiteNextButton = () => {
  return (
    <Button
      type="submit"
      className="hover:bg-brand-dark bg-brand-dark m-0 mt-1 flex cursor-pointer items-center gap-2 self-end rounded-lg border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#292637] !px-4 !py-5 text-xl leading-normal text-[#8e8c95]"
    >
      <ArrowRight className="h-8 w-8" />
      <span
        style={{
          background: "linear-gradient(91deg, #8e8c95 0.61%, #d9d9dc 99.17%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
        className="text-xl leading-normal"
      >
        Next
      </span>
    </Button>
  );
};

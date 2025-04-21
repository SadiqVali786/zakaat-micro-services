"use client";

import { useState } from "react";
import Image from "next/image";
import SumIcon from "@/../public/icons/add.svg";
import MinusIcon from "@/../public/icons/minus.svg";

const Accordion = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="cursor-pointer rounded-4xl border border-[#1d1b2c] bg-gradient-to-b from-[#030014] to-[#201d2f]"
      onClick={() => setIsOpen((prev) => !prev)}
      style={{ padding: "clamp(20px, 3.3vw, 30px) clamp(20px, 4.7vw, 60px)" }}
    >
      <div className="flex items-center justify-between self-stretch">
        <div
          className="leading-normal text-[#c4c0fb]"
          style={{ fontSize: "clamp(20px, 3.1vw, 26px)" }}
        >
          {question}
        </div>
        <Image
          src={isOpen ? MinusIcon : SumIcon}
          alt={isOpen ? "Collapse" : "Expand"}
          width={40}
          height={40}
        />
      </div>
      <div
        className={`h-px w-full overflow-hidden bg-[#292637] transition-all duration-500 ${
          isOpen ? "mt-5 max-h-px opacity-100" : "max-h-0 opacity-0"
        }`}
      />
      <div
        className={`overflow-hidden leading-normal text-[#c4c0fb] transition-all duration-500 ${
          isOpen ? "mt-5 max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {answer}
      </div>
    </div>
  );
};

export default Accordion;

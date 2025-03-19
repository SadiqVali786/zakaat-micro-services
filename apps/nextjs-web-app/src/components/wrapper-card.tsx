import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

type WrapperCardProps = {
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const WrapperCard: React.FC<WrapperCardProps> = ({ children, className, style, ...props }) => {
  return (
    <React.Fragment>
      <div
        className={cn(
          "border-neutral-10 from-brand-dark to-neutral-11 rounded-full border bg-gradient-to-b",
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

export default WrapperCard;

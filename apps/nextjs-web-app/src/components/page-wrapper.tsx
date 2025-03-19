import { cn } from "@/lib/utils";
import React from "react";

const PageWrapper = ({
  children,
  className,
  style,
  ...props
}: React.ComponentPropsWithoutRef<"main">) => {
  return (
    <main
      className={cn(
        "xs:border-x-[1px] border-neutral-11 relative min-h-screen max-w-[708px] grow",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </main>
  );
};

export default PageWrapper;

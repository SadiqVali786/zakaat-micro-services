import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

export default function Button({
  text,
  icon,
  className
}: {
  text: string;
  icon: StaticImageData;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "rounded-[8px] bg-gradient-to-r from-[#4135F3] to-[#BE52F2] p-[1px]",
        className
      )}
    >
      <div className="bg-brand-dark flex gap-x-2 rounded-[8px] px-4 py-2">
        <Image alt="post" src={icon} />
        <p>{text}</p>
      </div>
    </button>
  );
}

// import Link from "next/link";

// export default function Button({ children }: { children: React.ReactNode }) {
//   return (
//     <Link
//       className="flex items-center gap-2 py-2 px-5 rounded-lg border border-[#211f30] bg-gradient-to-b from-[#030014] to-[#292637] text-xl leading-normal font-dm-sans text-[#8e8c95]"
//       href={"/auth/register"}
//     >
//       {children}
//     </Link>
//   );
// }

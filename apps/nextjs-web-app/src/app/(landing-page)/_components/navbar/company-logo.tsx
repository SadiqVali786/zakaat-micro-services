import { APP_PATHS } from "@/config/path.config";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/logo/logo.png";

export const CompanyLogo = () => {
  return (
    <Link
      href={APP_PATHS.VERIFIER_DASHBOARD_SEARCH_APPLICANT}
      className="flex cursor-pointer items-center gap-1.5"
    >
      <Image src={Logo} alt="Company Logo" className="h-10 w-10" />
      <span className="hidden text-2xl font-normal lg:block">zakaat</span>
    </Link>
  );
};

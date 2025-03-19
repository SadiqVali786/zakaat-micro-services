import Image from "next/image";
import Logo from "@/../public/Logo/Logo.png";
import Link from "next/link";
import APP_PATHS from "@/config/path.config";

const NavbarBrand = () => {
  return (
    <Link href={APP_PATHS.HOME} className="flex cursor-pointer items-center gap-[6px]">
      <Image src={Logo} width={40} height={40} alt="logo" />
      <span className="hidden text-2xl sm:block">zakaat</span>
    </Link>
  );
};

export default NavbarBrand;

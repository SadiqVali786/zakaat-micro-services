import WrapperCard from "../wrapper-card";
import LogoWithText from "../LandingPage/LogoWithText";
import More from "@/../public/Icons/dashboard/more_horizontal_shade.png";

import SubMenu from "./sub-menu";
import Image from "next/image";

import DP from "@/../public/dashboard/dp.png";
import { verifierSidebar } from "@/lib/constant/app.constant";

export default function VerifierLeftSidebar() {
  return (
    <aside className="xs:flex sticky top-0 hidden max-h-screen max-w-[52px] grow flex-col justify-between py-8 lg:max-w-[286px]">
      <div className="xs:items-start flex flex-col items-center gap-y-[60px]">
        <LogoWithText />
        <div className="w-full">
          {verifierSidebar.map((item) => (
            <SubMenu key={item.label} icon={item.icon} title={item.label} path={item.path} />
          ))}
        </div>
      </div>
      <WrapperCard className="mr-[10px] flex items-center justify-between lg:px-[20px] lg:py-[10px]">
        <div className="flex items-center gap-x-1">
          <Image src={DP} alt="DP" />
          <div className="hidden flex-col leading-tight lg:flex">
            <p className="text-blue-50">Sadiq Vali</p>
            <p className="text-neutral-7">@sadiq_vali</p>
          </div>
        </div>
        <Image src={More} alt="more" className="hidden lg:block" />
      </WrapperCard>
    </aside>
  );
}

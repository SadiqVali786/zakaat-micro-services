import WrapperCard from "../wrapper-card";
import LogoWithText from "../LandingPage/LogoWithText";
import More from "@/../public/Icons/dashboard/more_horizontal_shade.png";
import SubMenu from "./sub-menu";
import Image from "next/image";

import DP from "@/../public/dashboard/dp.png";
import { donorSidebar } from "@/lib/constant/app.constant";

export default function DonorLeftSidebar() {
  return (
    <aside className="xs:flex sticky top-0 hidden max-h-screen min-w-[52px] flex-col justify-between py-8 lg:min-w-[286px]">
      <div className="xs:items-start flex w-full flex-col items-center gap-y-[60px]">
        <LogoWithText />
        <div className="w-full">
          {donorSidebar.map((item) => (
            <SubMenu key={item.label} icon={item.icon} title={item.label} path={item.path} />
          ))}
        </div>
      </div>
      <div className="lg:pr-[10px]">
        <WrapperCard className="flex w-full items-center justify-between lg:px-[20px] lg:py-[10px]">
          <div className="flex items-center gap-x-1">
            <Image src={DP} alt="DP" />
            <div className="hidden flex-col leading-tight lg:flex">
              <p className="text-blue-50">Sadiq Vali</p>
              <p className="text-neutral-7">@sadiq_vali</p>
            </div>
          </div>
          <Image src={More} alt="more" className="hidden lg:block" />
        </WrapperCard>
      </div>
    </aside>
  );
}

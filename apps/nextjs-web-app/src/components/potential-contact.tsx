import WrapperCard from "./wrapper-card";
import Image, { StaticImageData } from "next/image";

const PotentialContact = ({ fullName, dp }: { fullName: string; dp: StaticImageData }) => {
  return (
    <WrapperCard className="flex items-center justify-between px-[20px] py-[10px]">
      <div className="flex items-center gap-x-1">
        <Image src={dp} alt="more" />
        <div className="flex flex-col leading-tight">
          <p className="text-blue-50">{fullName}</p>
          <p className="text-neutral-7">@{fullName.toLowerCase().replace(" ", "-")}</p>
        </div>
      </div>
      <span className="text-[26px]">+10</span>
    </WrapperCard>
  );
};

export default PotentialContact;

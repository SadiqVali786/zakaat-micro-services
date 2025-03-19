import Image from "next/image";
import Reciever1 from "@/../public/dashboard/genuine-applications/reciever1.png";
import DP from "@/../public/dashboard/dp.png";
import ApplicationOptions from "./application-options";

type Props = {
  text: string;
  name: string;
  money: number;
  rank: number;
  id: bigint;
};

const Application = ({ text, name, money, rank, id }: Props) => {
  return (
    <div className="xs:border-x xs:border-t border-neutral-11 xs:rounded-[15px] flex min-h-[200vh] w-full flex-col gap-y-[10px] border-b-[1px] px-5">
      <div className="xs:flex-row flex flex-col items-center gap-4 pt-5">
        <Image
          src={Reciever1}
          alt="donation reciever"
          className="xs:max-w-40 xs:max-h-40 aspect-square max-h-80 max-w-80"
        />
        <p className="text-base leading-tight">{text}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between pb-5">
        <div className="flex items-center gap-x-3">
          <Image src={DP} alt="DP" />
          <div className="flex flex-col text-blue-100">
            <p className="xs:text-[16px] text-[13px] leading-tight">Verified By</p>
            <p className="xs:text-[16px] text-[13px] leading-tight">{name}</p>
          </div>
        </div>
        <p className="xs:text-[26px] text-[20px] text-blue-100">{money}</p>
        <p className="xs:text-[26px] text-[20px] text-blue-100">{rank}/10</p>
        <ApplicationOptions id={id} />
      </div>
    </div>
  );
};

export default Application;

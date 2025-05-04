import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { CustomDropdownMenuItems } from "./custom-dropdown-menu-items";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  reason: string;
  name: string;
  amount: number;
  upiId: string;
  rank: number;
  selfie: string;
  verifierImage: string;
  isItBookmark: boolean;
  applicationId: string;
  applicantName: string;
  applicantId: string;
};

export const ZakaatApplication = ({
  reason,
  name,
  amount,
  upiId,
  rank,
  selfie,
  verifierImage,
  isItBookmark,
  applicationId,
  applicantName,
  applicantId
}: Props) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="border-neutral-11 flex w-full flex-col gap-y-[10px] rounded-2xl border-[1px] px-5">
          <div className="flex flex-col items-center gap-4 pt-5 sm:flex-row">
            <Image
              src={selfie ? selfie : "https://avatars.githubusercontent.com/u/206494287?v=4"}
              width={160}
              height={160}
              alt="applicant image"
              className="bg-neutral-11 aspect-square h-40 w-40 rounded-[12px] object-contain"
            />
            <p className="self-start text-lg leading-tight">{reason}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between pb-5">
            <div className="flex items-center gap-x-3">
              <Image
                src={verifierImage}
                width={50}
                height={50}
                alt="verifier image"
                className="xs:max-w-40 xs:max-h-40 aspect-square max-h-80 max-w-80 rounded-full"
              />
              <div className="flex flex-col text-blue-100">
                <p className="text-[13px] leading-tight sm:text-base">Verified By</p>
                <p className="text-[13px] leading-tight sm:text-sm">{name}</p>
              </div>
            </div>
            <p className="text-[20px] text-blue-100 sm:text-2xl">{amount}</p>
            <p className="text-[20px] text-blue-100 sm:text-2xl">{rank}/10</p>
            <MoreVertical className="text-blue-100" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-neutral-12 min-h-fit w-45" align="end">
        <CustomDropdownMenuItems
          isItBookmark={isItBookmark}
          applicantId={applicantId}
          amount={amount}
          upiId={upiId}
          applicantName={applicantName}
          applicantImage={selfie}
          applicationId={applicationId}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

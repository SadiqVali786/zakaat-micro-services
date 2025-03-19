import { formatRelativeDate } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

export default function Tweet({
  name,
  time,
  applicationLink,
  tweetBody,
  dp
}: {
  name: string;
  time: Date;
  applicationLink?: string;
  tweetBody: string;
  dp: StaticImageData;
}) {
  return (
    <div className="xs:p-8 border-neutral-11 flex min-h-screen items-start gap-2 border-b-[1px] p-4">
      <Image src={dp} alt="DP" className="h-[50px] w-[50px]" />
      <div>
        <div className="text-neutral-7 flex gap-x-1">
          <p className="text-blue-50">{name}</p>
          <p>@{name.toLowerCase().replace(" ", "-")}</p>
          <p>-</p>
          <p>{formatRelativeDate(time)}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-base">{tweetBody}</p>
          {!!applicationLink && (
            <p>
              <br />
              Link to the zakaat Applicant <br />
              <span className="text-purple-300">{applicationLink}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

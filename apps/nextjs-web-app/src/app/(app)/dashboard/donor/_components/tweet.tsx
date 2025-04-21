import { formatRelativeDate } from "@/lib/utils";
import Image from "next/image";

export function Tweet({
  name,
  email,
  time,
  applicationLink,
  content,
  dp
}: {
  name: string;
  email: string;
  time: Date;
  applicationLink?: string;
  content: string;
  dp: string;
}) {
  return (
    <div className="border-neutral-11 flex items-start gap-2 rounded-xl border-[1px] p-4 sm:p-8">
      <Image src={dp} alt="author-dp" width={48} height={48} className="h-12 w-12 rounded-full" />
      <div>
        <div className="text-neutral-7 flex gap-x-1">
          <p className="text-blue-50">{name}</p>
          <p className="hidden sm:block">@{email.split("@")[0]}</p>
          <p>-</p>
          <p>{formatRelativeDate(time)}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-base">{content}</p>
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

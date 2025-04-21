"use client";

import { SafeServerAction } from "@/actions/application.action";
import { ApplicationWithAuthorAndVerifier } from "@/types/fetch-application-action.type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSafeAction } from "safe-actions-state";
import { ZakaatApplication } from "../../../_components/zakaat-application";

export const ApplicationsInfiniteScrollFeed = () => {
  const [applications, setApplications] = useState<ApplicationWithAuthorAndVerifier[]>([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const longitude = searchParams.get("longitude") ?? "";
  const latitude = searchParams.get("latitude") ?? "";

  const { clientAction, isPending, fieldErrors, setFieldErrors, error, data, abortAction } =
    useSafeAction(SafeServerAction, {
      toastMessages: {
        loading: "Fetching applications...",
        success: "Applications fetched successfully"
      },
      onStart: () => console.log("STARTED"),
      onSuccess: (data) => {
        console.log("SUCCESS", data);
        if (data && data.length > 0) {
          setApplications((prev) => [...prev, ...data]);
          setPage((prev) => prev + 1);
        } else {
          setHasMore(false);
        }
      },
      onError: (error) => console.log("ERROR", error),
      onComplete: () => console.log("COMPLETE"),
      retries: 3
    });

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (timeout) return;
      timeout = setTimeout(async () => {
        if (
          window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 &&
          hasMore &&
          !isPending
        ) {
          await clientAction({ longitude, latitude, page });
        }
        timeout = null;
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [page, hasMore, isPending, clientAction, longitude, latitude]);

  return (
    <div className="flex flex-col gap-y-5">
      {applications.map((application) => (
        <ZakaatApplication
          key={application.id}
          reason={application.reason}
          name={application.verifier.name}
          amount={application.amount}
          rank={application.rating}
          selfie={application.author.selfie}
          verifierImage={application.verifier.image}
          isItBookmark={false}
          applicationId={application.id}
          applicantName={application.author.name}
          applicantId={application.author.id}
        />
      ))}
    </div>
  );
};

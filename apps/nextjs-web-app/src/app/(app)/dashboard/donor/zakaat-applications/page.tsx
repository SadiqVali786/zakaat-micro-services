import React from "react";
import { fetchApplicationsHandler } from "@/actions/application.action";
import { ZakaatApplication } from "../../_components/zakaat-application";
import { ApplicationsInfiniteScrollFeed } from "./_component/applications-infinite-scroll-feed";

type SearchParams = {
  longitude?: string;
  latitude?: string;
  [key: string]: string | string[] | undefined;
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const DonorGenuineApplicationsPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const longitude = params.longitude || "";
  const latitude = params.latitude || "";
  const applications = await fetchApplicationsHandler({ longitude, latitude, page: 1 });

  return (
    <div className="mb-5 flex flex-col gap-y-5 px-2 sm:px-4">
      {applications.data?.map((application) => (
        <div key={application.id} className="">
          <ZakaatApplication
            reason={application.reason}
            name={application.verifier.name}
            amount={application.amount}
            upiId={application.author.upiId}
            rank={application.rating}
            selfie={application.author.selfie}
            verifierImage={application.verifier.image}
            isItBookmark={false}
            applicationId={application.id}
            applicantName={application.author.name}
            applicantId={application.author.id}
          />
        </div>
      ))}
      <ApplicationsInfiniteScrollFeed />
    </div>
  );
};

export default DonorGenuineApplicationsPage;

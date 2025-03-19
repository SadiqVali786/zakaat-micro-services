 
import Application from "@/components/application";
import GuestScrollFeed from "@/components/guest-scroll-feed";
import InfiniteFeedbar from "@/components/infinite-feed-bar";
import PageWrapper from "@/components/page-wrapper";
import { APPLICATIONS_PER_PAGE } from "@/config/app.config";
import { prisma } from "@repo/mongodb";

const GenuineApplications = async () => {
  const applications = await prisma.application.findMany({
    select: {
      id: true,
      amount: true,
      reason: true,
      rating: true,
      Verifier: {
        select: { name: true, selfie: true, id: true }
      }
    },
    take: APPLICATIONS_PER_PAGE,
    orderBy: { createdAt: "desc" }
  });

  return (
    <PageWrapper>
      <InfiniteFeedbar type="applications" />
      <div className="xs:px-4 flex flex-col gap-y-5 py-5">
        {applications.map((application) => (
          <Application
            key={application.id}
            id={application.id}
            name={application.Verifier?.name as string}
            money={application.amount}
            rank={application.rating}
            text={application.reason}
          />
        ))}
        {applications.length === APPLICATIONS_PER_PAGE && (
          <GuestScrollFeed id={applications[applications.length - 1]!.id} />
        )}
      </div>
    </PageWrapper>
  );
};

export default GenuineApplications;

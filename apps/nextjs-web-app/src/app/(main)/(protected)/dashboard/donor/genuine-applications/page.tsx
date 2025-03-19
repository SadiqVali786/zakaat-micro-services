 
import { fetchInfiniteApplicationsFeed } from "@/actions/application.actions";
import Application from "@/components/application";
import ApplicationsInfiniteScrollFeed from "@/components/applications-infinite-scroll-feed";
import InfiniteFeedbar from "@/components/infinite-feed-bar";
import PageWrapper from "@/components/page-wrapper";
// import Application from "@/components/application";
// import ApplicationsInfiniteScrollFeed from "@/components/applications-infinite-scroll-feed";
// import InfiniteFeedbar from "@/components/infinite-feed-bar";
// import PageWrapper from "@/components/page-wrapper";
import { APPLICATIONS_PER_PAGE } from "@/config/app.config";
import { FetchedApplicationsType } from "@/types/application.types";
// import { FetchedApplicationsType } from "@/types/application.types";

const GenuineApplications = async () => {
  const result = await fetchInfiniteApplicationsFeed({}, { distance: 0 });
  const applications: FetchedApplicationsType = result.additional.applications;

  return (
    <PageWrapper>
      <InfiniteFeedbar type="applications" />
      <div className="xs:px-4 flex flex-col gap-y-5 py-5">
        {applications.map((application) => (
          <Application
            key={application?.id}
            id={application?.id!}
            name={application?.Verifier.name as string}
            money={application?.amount as number}
            rank={application?.rating as number}
            text={application?.reason as string}
          />
        ))}
        {applications.length === APPLICATIONS_PER_PAGE && (
          <ApplicationsInfiniteScrollFeed
            dis={applications[applications.length - 1]?.Verifier.distance}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default GenuineApplications;

{
  /* {Array.from({ length: 20 }).map((_, key) => (
  <Application
    id="hello"
    key={key}
    fullName="Sadiq Vali"
    money="₹20,000"
    rank="7"
    text="Aisha Begum, a 45-year-old widow, struggles to raise her three
      children with a monthly income of ₹6,000. Due to unpaid school fees,
      her children risk losing access to education. Aisha requests ₹20,000
      to cover the overdue fees and purchase necessary school supplies.
      This financial support will help her children continue their studies
      and break the cycle of poverty, giving them hope for a brighter
      future."
  />
))} */
}

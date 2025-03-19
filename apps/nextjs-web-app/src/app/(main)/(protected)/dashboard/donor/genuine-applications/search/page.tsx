import Application from "@/components/application";
import InfiniteFeedbar from "@/components/infinite-feed-bar";
import PageWrapper from "@/components/page-wrapper";
import { APPLICATIONS_PER_PAGE } from "@/config/app.config";
import { prisma } from "@repo/mongodb";

const SearchApplications = async ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const applications = await prisma.application.findMany({
    where: {
      reason: {
        contains: searchParams.searchTerm as string,
        mode: "insensitive"
      }
    },
    select: {
      id: true,
      amount: true,
      reason: true,
      hide: true,
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
      <InfiniteFeedbar type="tweets" />
      <div className="xs:px-4 flex flex-col gap-y-5 pt-5">
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
      </div>
    </PageWrapper>
  );
};

export default SearchApplications;

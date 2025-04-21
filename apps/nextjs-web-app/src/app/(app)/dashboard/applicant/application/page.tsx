import { prisma } from "@repo/mongodb";
import { auth } from "@/auth";
import { ZakaatApplication } from "../../_components/zakaat-application";

const ApplicantApplicationPage = async () => {
  const session = await auth();
  const application = await prisma.application.findUnique({
    where: { authorId: session?.user.id },
    include: { verifier: true, author: true }
  });

  return (
    <div className="mb-5 flex flex-col gap-y-5 px-2 sm:px-4">
      {/* {application && (
        <div key={application.id} className="min-h-[150vh]">
          <ZakaatApplication
            reason={application.reason}
            name={application.verifier?.name ?? ""}
            amount={application.amount}
            rank={application.rating}
            selfie={application.author.selfie ?? ""}
            verifierImage={application.verifier?.image ?? ""}
          />
        </div>
      )} */}
    </div>
  );
};

export default ApplicantApplicationPage;

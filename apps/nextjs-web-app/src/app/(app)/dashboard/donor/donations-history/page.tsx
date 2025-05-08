import { prisma } from "@repo/mongodb";
import { auth } from "@/auth";
import { ZakaatApplication } from "../../_components/zakaat-application";
import { APP_PATHS } from "@/config/path.config";
import { redirect } from "next/navigation";
import { UserRole } from "@repo/common/types";

const DonorDonationsHistoryPage = async () => {
  const session = await auth();
  if (session?.user.role !== UserRole.Donor) {
    if (session?.user.role === UserRole.Applicant) {
      redirect(APP_PATHS.APPLICANT_DASHBOARD_MESSAGES);
    } else if (session?.user.role === UserRole.Verifier) {
      redirect(APP_PATHS.VERIFIER_DASHBOARD_SEARCH_APPLICANT);
    } else {
      redirect(APP_PATHS.HOME);
    }
  }

  const donations = await prisma.application.findMany({
    where: { donorUserId: session?.user.id },
    include: { verifier: true, author: true }
  });

  return (
    <div className="flex flex-col gap-y-5 px-2 sm:px-4">
      {donations.map((donation) => (
        <div key={donation.id} className="min-h-[150vh]">
          <ZakaatApplication
            reason={donation.reason}
            upiId={donation.author.upiId!}
            name={donation.verifier?.name ?? ""}
            amount={donation.amount}
            rank={donation.rating}
            selfie={donation.author.selfie ?? ""}
            verifierImage={donation.verifier?.image ?? ""}
            isItBookmark={false}
            applicationId={donation.author.id}
            applicantName={donation.author.name ?? ""}
            applicantId={donation.author.id}
          />
        </div>
      ))}
    </div>
  );
};

export default DonorDonationsHistoryPage;

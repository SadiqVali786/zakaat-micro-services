import { prisma } from "@repo/mongodb";
import { auth } from "@/auth";
import { ZakaatApplication } from "../../_components/zakaat-application";

const DonorDonationsHistoryPage = async () => {
  const session = await auth();
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

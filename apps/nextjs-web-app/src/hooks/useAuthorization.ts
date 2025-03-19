"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import APP_PATHS from "@/config/path.config";
import { UserRole } from "@repo/mongodb";

const useAuthorization = () => {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // if (pathname.includes(APP_PATHS.WELCOME) && session.data?.user.phoneNum) {
    //   switch (session.data.user.role) {
    //     case UserRole.Verifier:
    //       router.replace(APP_PATHS.SEARCH_APPLICANT);
    //       break;
    //     case UserRole.Donor:
    //       router.replace(APP_PATHS.ZAKAAT_APPLICATIONS);
    //       break;
    //     default:
    //       router.replace(APP_PATHS.HOME);
    //   }
    // }

    if (session.status === "unauthenticated") {
      router.replace(APP_PATHS.SIGNIN);
      return;
    }

    if (session.status === "authenticated") {
      const user = session.data?.user;

      if (!user) {
        router.replace(APP_PATHS.SIGNIN);
        return;
      }

      // if (!user.phoneNum) {
      //   router.replace(APP_PATHS.WELCOME);
      //   return;
      // }

      if (
        (pathname.includes("verifier") && user.role !== UserRole.Verifier) ||
        (pathname.includes("donor") && user.role !== UserRole.Donor)
      )
        router.replace(APP_PATHS.SIGNIN);

      if (pathname === APP_PATHS.SIGNIN && user.role === UserRole.Verifier)
        router.replace(APP_PATHS.SEARCH_APPLICANT);
      if (pathname === APP_PATHS.SIGNIN && user.role === UserRole.Donor)
        router.replace(APP_PATHS.ZAKAAT_APPLICATIONS);
    }
  }, [session, router, pathname]);

  return { session, router, pathname };
};

export default useAuthorization;

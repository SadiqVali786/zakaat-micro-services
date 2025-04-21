import { APP_PATHS } from "@/config/path.config";
import { FileUser, Search } from "lucide-react";

export const VerifierMenuItems = [
  {
    title: "Search Applicant",
    url: APP_PATHS.VERIFIER_DASHBOARD_SEARCH_APPLICANT,
    icon: Search,
    value: "search-applicant"
  },
  {
    title: "Apply",
    url: APP_PATHS.VERIFIER_DASHBOARD_APPLY,
    icon: FileUser,
    value: "apply"
  }
];

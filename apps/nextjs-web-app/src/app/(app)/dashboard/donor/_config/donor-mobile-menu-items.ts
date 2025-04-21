import { APP_PATHS } from "@/config/path.config";
import { Twitter, MessageCircle, AppWindow, BookmarkPlus } from "lucide-react";

export const DonorMobileMenuItems = [
  {
    title: "Tweets",
    url: APP_PATHS.DONOR_DASHBOARD_TWEETS,
    Icon: Twitter,
    value: "tweets"
  },
  {
    title: "Messages",
    url: APP_PATHS.DONOR_DASHBOARD_MESSAGES,
    Icon: MessageCircle,
    value: "messages"
  },
  {
    title: "Applications",
    url: APP_PATHS.DONOR_DASHBOARD_ZAKAAT_APPLICATIONS,
    Icon: AppWindow,
    value: "zakaat-applications"
  },
  {
    title: "Bookmarks",
    url: APP_PATHS.DONOR_DASHBOARD_BOOKMARKED_APPLICATIONS,
    Icon: BookmarkPlus,
    value: "bookmarked-applications"
  }
];

import { APP_PATHS } from "@/config/path.config";
import {
  Twitter,
  SendToBack,
  MessageCircle,
  AppWindow,
  BookmarkPlus,
  History,
  Video
} from "lucide-react";

export const DonorMenuItems = [
  {
    title: "Tweets",
    url: APP_PATHS.DONOR_DASHBOARD_TWEETS,
    icon: Twitter
  },
  {
    title: "Following Tweets",
    url: APP_PATHS.DONOR_DASHBOARD_FOLLOWING_TWEETS,
    icon: SendToBack
  },
  {
    title: "Messages",
    url: APP_PATHS.DONOR_DASHBOARD_MESSAGES,
    icon: MessageCircle
  },
  {
    title: "Zakaat Applications",
    url: APP_PATHS.DONOR_DASHBOARD_ZAKAAT_APPLICATIONS,
    icon: AppWindow
  },
  {
    title: "Bookmarked Applications",
    url: APP_PATHS.DONOR_DASHBOARD_BOOKMARKED_APPLICATIONS,
    icon: BookmarkPlus
  },
  {
    title: "Donations History",
    url: APP_PATHS.DONOR_DASHBOARD_DONATIONS_HISTORY,
    icon: History
  },
  {
    title: "Video Call",
    url: APP_PATHS.DONOR_DASHBOARD_VIDEO_CALL,
    icon: Video
  }
];

import { APP_PATHS } from "@/config/path.config";
import { MessageCircle, AppWindow, Video } from "lucide-react";

export const ApplicantMenuItems = [
  {
    title: "Messages",
    url: APP_PATHS.APPLICANT_DASHBOARD_MESSAGES,
    icon: MessageCircle,
    value: "messages"
  },
  {
    title: "My Application",
    url: APP_PATHS.APPLICANT_DASHBOARD_APPLICATION,
    icon: AppWindow,
    value: "my-application"
  },
  {
    title: "Video Call",
    url: APP_PATHS.APPLICANT_DASHBOARD_VIDEO_CALL,
    icon: Video,
    value: "video-call"
  }
];

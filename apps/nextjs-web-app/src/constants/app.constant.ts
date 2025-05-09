import { APP_PATHS } from "@/config/path.config";

export const GUEST_NAVBAR_MENU_ITEMS = [
  {
    title: "Home",
    link: APP_PATHS.HOME
  },
  {
    title: "About",
    link: APP_PATHS.ABOUT
  },
  {
    title: "Testimonials",
    link: APP_PATHS.TESTIMONIALS
  },
  {
    title: "Faqs",
    link: APP_PATHS.FAQS
  },
  {
    title: "Download",
    link: APP_PATHS.DOWNLOAD
  }
];

export const ADMIN_NAVBAR_MENU_ITEMS = [
  {
    title: "Home",
    link: APP_PATHS.HOME
  },
  {
    title: "Download",
    link: APP_PATHS.DOWNLOAD
  }
];

export const APPLICANT_NAVBAR_MENU_ITEMS = [
  {
    title: "Home",
    link: APP_PATHS.HOME
  },
  {
    title: "My application",
    link: APP_PATHS.APPLICANT_DASHBOARD_APPLICATION
  },
  {
    title: "Messages",
    link: APP_PATHS.APPLICANT_DASHBOARD_MESSAGES
  },
  {
    title: "Download",
    link: APP_PATHS.DOWNLOAD
  }
];

export const VERIFIER_NAVBAR_MENU_ITEMS = [
  {
    title: "Search Applicant",
    link: APP_PATHS.VERIFIER_DASHBOARD_SEARCH_APPLICANT
  },
  {
    title: "Apply",
    link: APP_PATHS.VERIFIER_DASHBOARD_APPLY
  },
  {
    title: "Download",
    link: APP_PATHS.DOWNLOAD
  }
];

export const DONOR_NAVBAR_MENU_ITEMS = [
  {
    title: "Home",
    link: APP_PATHS.HOME
  },
  {
    title: "Applications",
    link: APP_PATHS.DONOR_DASHBOARD_LOCATION_SETTINGS
  },
  {
    title: "Tweets",
    link: APP_PATHS.DONOR_DASHBOARD_TWEETS
  },
  {
    title: "Messages",
    link: APP_PATHS.DONOR_DASHBOARD_MESSAGES
  },
  {
    title: "Download",
    link: APP_PATHS.DOWNLOAD
  }
];

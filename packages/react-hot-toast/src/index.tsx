import toast from "react-hot-toast";
import { ToastCardMessage } from "./toast-message";

// Generic Success Toast
export const successToast = (msg: string, icon?: string) => {
  toast.success(msg, { icon });
};

// Generic Error Toast
export const errorToast = (msg: string, icon?: string) => {
  toast.error(msg, { icon });
};

// Generic Info Toast
export const infoToast = (msg: string, icon?: string) => {
  toast(msg, { icon });
};

// Promisified Toast for Async Operation Status
export const promisifiedToast = (hi: () => Promise<string>) => {
  return toast.promise(hi(), {
    loading: "🧕🏻 Processing your request...",
    success: (message: string) => `${message}`,
    error: (message: string) => `${message}`
  });
};

// Custom Toast with WhatsApp-like Message UI
export const showWhatsappMessage = (heading: string, subHeading: string, image: string) => {
  toast.custom((t) => ToastCardMessage({ heading, subHeading, image, t, dismiss: toast.dismiss }));
};

// displayToast("Successfully toasted!", "👏")
//
//
//
// displayToast("This didn't work.", "👏")
//
//
//
// const hi = async () => {
//   try {
//     // await new Promise((resolve, reject) => setTimeout(reject, 1000));
//     await new Promise((resolve, reject) => setTimeout(resolve, 1000));
//     return "Email Sent Successfully";
//   } catch {
//     throw new Error("Email Failed to sent");
//   }
// };
// promisifiedToast(hi);
//
//
//
// infoToast("Hello Darkness!", "👏");
//
//
//
// showWhatsappMessage(
//   "Emilia Gates",
//   "Sure! 8:30pm works great!",
//   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
// );

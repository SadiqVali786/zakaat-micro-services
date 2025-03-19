import Image from "next/image";

type ToastMessageProps = {
  heading: string;
  subHeading: string;
  image: string;
  t: {
    visible: boolean;
    id: string;
  };
  dismiss: (id: string) => void;
};

export const ToastCardMessage = ({ heading, subHeading, image, t, dismiss }: ToastMessageProps) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
    >
      <div className="w-0 flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Image className="h-10 w-10 rounded-full" width={100} height={100} src={image} alt="" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{heading}</p>
            <p className="mt-1 text-sm text-gray-500">{subHeading}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => dismiss(t.id)}
          className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { startTransition, useEffect } from "react";

const useModifiedInfiniteScroll = ({
  action,
  hasMore,
  distance,
  isPending,
  offset = 100,
  delay = 1000
}: any) => {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - offset &&
        isPending === false &&
        hasMore
      ) {
        if (timeoutId) return;

        timeoutId = setTimeout(() => {
          timeoutId = null;
          startTransition(() => {
            action({ distance });
          });
        }, delay);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore]);
};

export default useModifiedInfiniteScroll;

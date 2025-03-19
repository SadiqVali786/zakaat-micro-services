/* eslint-disable @typescript-eslint/no-explicit-any */
import { startTransition, useEffect } from "react";

const useInfiniteScroll = ({ action, cursor, isPending, offset = 100, delay = 1000 }: any) => {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - offset &&
        isPending === false &&
        cursor
      ) {
        if (timeoutId) return;

        timeoutId = setTimeout(() => {
          timeoutId = null;
          startTransition(() => {
            action({ id: cursor });
          });
        }, delay);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [cursor]);
};

export default useInfiniteScroll;

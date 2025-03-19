"use client";

import { fetchBookmarkedApplicationsFeedAction } from "@/actions/application.actions";
import { useActionState, useEffect, useState } from "react";
import Application from "./application";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import { FetchedApplicationType } from "@/types/application.types";

type Props = { id: bigint };

const BookmarksScrollFeed = ({ id }: Props) => {
  const [cursor, setCursor] = useState<bigint>(id);
  const [applications, setApplications] = useState<FetchedApplicationType[]>([]);

  const [actionState, action, isPending] = useActionState(
    fetchBookmarkedApplicationsFeedAction,
    null
  );

  useEffect(() => {
    if (actionState && actionState.additional.length && isPending == false) {
      const fetchedApplications = actionState.additional as FetchedApplicationType[];
      setCursor(fetchedApplications[fetchedApplications.length - 1]?.id!);
      setApplications((prev) => [...prev, ...fetchedApplications]);
    }
  }, [actionState, isPending]);

  useInfiniteScroll({ action, cursor, isPending });

  return (
    <div>
      {applications.map((application) => (
        <Application
          key={application?.id}
          id={application?.id!}
          name={application?.Verifier?.name as string}
          money={application?.amount as number}
          rank={application?.rating as number}
          text={application?.reason as string}
        />
      ))}
    </div>
  );
};

export default BookmarksScrollFeed;

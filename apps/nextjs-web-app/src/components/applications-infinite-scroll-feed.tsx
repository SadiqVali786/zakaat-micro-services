"use client";

import { fetchInfiniteApplicationsFeed } from "@/actions/application.actions";
import { Fragment, useActionState, useEffect, useState } from "react";
import Application from "./application";
import useModifiedInfiniteScroll from "@/hooks/use-modified-infinite-scroll";
import {
  ApplicationsActionStateAdditionalType,
  FetchedApplicationsType
} from "@/types/application.types";

export default function ApplicationsInfiniteScrollFeed({ dis = 0 }: { dis?: number }) {
  const [applications, setApplications] = useState<FetchedApplicationsType>([]);
  const [distance, setDistance] = useState<number>(dis);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [actionState, action, isPending] = useActionState(fetchInfiniteApplicationsFeed, null);
  useEffect(() => {
    if (actionState && actionState.additional.applications.length && isPending == false) {
      const additional = actionState.additional as ApplicationsActionStateAdditionalType;
      const length = additional.applications.length;
      setHasMore(additional.hasMore);
      setDistance(additional.applications[length - 1].Verifier.distance);
      setApplications((prev) => [...prev, ...additional.applications]);
    }
  }, [actionState, isPending]);

  useModifiedInfiniteScroll({
    action,
    hasMore,
    distance,
    isPending
  });

  return (
    <Fragment>
      {applications.map((application) => (
        <Application
          key={application.id}
          id={application.id}
          fullName={application.Verifier.fullname}
          money={application.amount}
          rank={application.rating}
          text={application.reason}
        />
      ))}
    </Fragment>
  );
}

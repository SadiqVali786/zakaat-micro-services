"use client";

import { fetchBookmarkedApplicationsFeedAction } from "@/actions/application.actions";
import { useActionState, useEffect, useState } from "react";
import Application from "./application";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";

type Props = { id: string };

type Application = {
  amount: number;
  reason: string;
  hide: boolean;
  rating: number;
  id: string;
  Verifier: {
    fullname: string;
    phoneNum: string;
    id: string;
    selfie: string;
  } | null;
};

const HistoryScrollFeed: React.FC<Props> = ({ id }) => {
  const [cursor, setCursor] = useState<string>(id);
  const [applications, setApplications] = useState<Application[]>([]);

  const [actionState, action, isPending] = useActionState(
    fetchBookmarkedApplicationsFeedAction,
    null
  );

  useEffect(() => {
    if (actionState && actionState.additional.length && isPending == false) {
      const additional = actionState.additional as Application[];
      const length = additional.length;
      setCursor(additional[length - 1].id);
      setApplications((prev) => [...prev, ...additional]);
    }
  }, [actionState, isPending]);

  useInfiniteScroll({ action, cursor, isPending });

  return (
    <div>
      {applications.map((application) => (
        <Application
          key={application.id}
          id={application.id}
          fullName={application.Verifier?.fullname as string}
          money={application.amount}
          rank={application.rating}
          text={application.reason}
        />
      ))}
    </div>
  );
};

export default HistoryScrollFeed;

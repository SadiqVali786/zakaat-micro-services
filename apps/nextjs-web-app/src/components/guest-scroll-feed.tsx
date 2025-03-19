"use client";

import { fetchGuestApplicationsFeedAction } from "@/actions/application.actions";
import { useActionState, useEffect, useState } from "react";
import Application from "./application";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";

type Props = { id: bigint };

type Application = {
  amount: number;
  reason: string;
  hide: boolean;
  rating: number;
  id: bigint;
  Verifier: {
    name: string;
    phoneNum: string;
    id: string;
    selfie: string;
  } | null;
};

const GuestScrollFeed = ({ id }: Props) => {
  const [cursor, setCursor] = useState<bigint>(id);
  const [applications, setApplications] = useState<Application[]>([]);

  const [actionState, action, isPending] = useActionState(fetchGuestApplicationsFeedAction, null);

  useEffect(() => {
    if (actionState && actionState.additional.length && isPending == false) {
      const additional = actionState.additional as Application[];
      const length = additional.length;
      setCursor(additional[length - 1]!.id);
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
          name={application.Verifier?.name as string}
          money={application.amount}
          rank={application.rating}
          text={application.reason}
        />
      ))}
    </div>
  );
};

export default GuestScrollFeed;

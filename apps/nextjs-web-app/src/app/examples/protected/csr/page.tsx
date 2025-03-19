"use client";

import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Not Authenticated</div>;

  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}

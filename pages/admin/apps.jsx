import React, { useEffect } from "react";
import Layout from "../../components/layout";
import { AppList } from "../../components/MentorAppComponents";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function MentorApplications() {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    switch (status) {
      case "unauthenticated":
        router.push("/api/auth/signin");
        break;
    }
  }, [status, router]);

  return (
    <Layout>
      {status == "authenticated" && <AppList reviewerId={session.user.id} />}
    </Layout>
  );
}

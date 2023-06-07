import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { AppList } from "../../components/MentorAppComponents";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

export default function MentorApplications({ reviewerId }) {
  const { status } = useSession();
  const router = useRouter();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    switch (status) {
      case "unauthenticated":
        router.push("/api/auth/signin");
        break;
      case "authenticated":
        axios
          .get("/api/admin/apps")
          .then(({ data }) => {
            setApps(data);
          })
          .catch(() => router.push("/"));
        break;
    }
  }, [status, router]);

  return (
    <Layout>
      <AppList reviewerId={reviewerId} apps={apps} />
    </Layout>
  );
}

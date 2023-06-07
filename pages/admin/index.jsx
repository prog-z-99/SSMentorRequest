import { React, useEffect, useState } from "react";
import Layout from "../../components/layout";
import { AdminComponent } from "../../components/AdminComponent";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Admins() {
  const { status } = useSession();
  const router = useRouter();

  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    switch (status) {
      case "unauthenticated":
        router.push("/api/auth/signin");
        break;
      case "authenticated":
        axios
          .get("/api/admin")
          .then(({ data }) => setMentors(data))
          .catch(() => router.push("/"));
        break;
    }
  }, [status, router]);

  return (
    <Layout>
      <AdminComponent mentors={mentors} />
    </Layout>
  );
}

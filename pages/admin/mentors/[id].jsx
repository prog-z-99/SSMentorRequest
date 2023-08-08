import { React, useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { MentorRequestTable } from "../../../components/MentorRequestComponents";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

export default function MentorById() {
  const { status } = useSession();
  const router = useRouter();
  const [mentor, setMentor] = useState();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    switch (status) {
      case "unauthenticated":
        router.push("/api/auth/signin");
        break;
      case "authenticated":
        axios.get(`/api/admin/mentor/${router.query.id}`).then(({ data }) => {
          console.log(data);
          setMentor(data.mentor);
          setRequests(data.requests);
        });
    }
  }, [status, router]);

  return (
    <Layout>
      {mentor?.discordName} - {mentor?.discordId}
      <MentorRequestTable requests={requests} />
    </Layout>
  );
}

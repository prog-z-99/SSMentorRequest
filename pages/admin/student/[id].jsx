import { getToken } from "next-auth/jwt";
import Layout from "../../../components/layout";
import {
  getStudentRequestsByDiscordId,
  isUserAdmin,
} from "../../../util/databaseAccess";
import React from "react";
import { MentorRequestTable } from "../../../components/MentorRequestComponents";

export default function StudentRequestsById({ requests }) {
  return (
    <Layout>
      <MentorRequestTable requests={requests} />
    </Layout>
  );
}

export async function getServerSideProps({ req, params }) {
  const fetchRequests = getStudentRequestsByDiscordId(params.id);
  const token = await getToken({ req });

  if (!token) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const user = await isUserAdmin(token.sub);

  if (!user)
    return {
      redirect: {
        destination: "/",
      },
    };

  return {
    props: { requests: await fetchRequests },
  };
}

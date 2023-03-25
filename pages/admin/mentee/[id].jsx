import { getToken } from "next-auth/jwt";
import Layout from "../../../components/layout";
import {
  getMenteeRequestsByDiscordId,
  isUserAdmin,
} from "../../../util/databaseAccess";
import React from "react";

export default function MenteeById({ requests }) {
  return <Layout>soon...</Layout>;
}

export async function getServerSideProps({ req, params }) {
  const requests = await getMenteeRequestsByDiscordId(params.id);
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
    props: { requests },
  };
}

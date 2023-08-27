import { React } from "react";
import Layout from "../../../components/layout";
import { MentorRequestTable } from "../../../components/MentorRequestComponents";

import { useRouter } from "next/router";

import useAuthTest from "../../../hooks/useAuthTest";
import { LoaderWithLayout } from "../../../components/Styles";

export default function MentorById() {
  const router = useRouter();
  const { mentor, requests, loading } = useAuthTest(
    `/api/admin/mentor/${router.query.id}`
  );

  if (loading) return <LoaderWithLayout />;

  return (
    <Layout>
      {mentor?.discordName} - {mentor?.discordId}
      <MentorRequestTable requests={requests} isAdmin={true} />
    </Layout>
  );
}

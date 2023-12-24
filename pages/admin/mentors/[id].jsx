import { React } from "react";
import Layout from "../../../components/layout";
import { MentorRequestTable } from "../../../components/MentorRequestComponents";
import { useRouter } from "next/router";
import useAuthTest from "../../../hooks/useAuthTest";

export default function MentorById() {
  const router = useRouter();
  const { mentor, requests, loading, notAuth } = useAuthTest(
    `/api/admin/mentor/${router.query.id}`,
    true
  );

  return (
    <Layout loading={loading} notAuth={notAuth}>
      {mentor?.discordName} - {mentor?.discordId}
      <MentorRequestTable requests={requests} isAdmin={true} />
    </Layout>
  );
}

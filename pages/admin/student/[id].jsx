import Layout from "../../../components/layout";
import React from "react";
import { MentorRequestTable } from "../../../components/MentorRequestComponents";
import { useRouter } from "next/router";
import useAuthTest from "../../../hooks/useAuthTest";

export default function StudentRequestsById() {
  const router = useRouter();
  const { requests, loading, notAuth } = useAuthTest(
    `/api/student/${router.query.id}`.true
  );

  return (
    <Layout loading={loading} notAuth={notAuth}>
      <MentorRequestTable requests={requests} />
    </Layout>
  );
}

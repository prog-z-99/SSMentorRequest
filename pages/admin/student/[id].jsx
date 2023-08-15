import Layout from "../../../components/layout";
import React from "react";
import { MentorRequestTable } from "../../../components/MentorRequestComponents";
import { useRouter } from "next/router";
import { useAuthTest } from "../../../hooks/useAuthTest";
import { Loader } from "@mantine/core";

export default function StudentRequestsById() {
  const router = useRouter();
  const { requests, loading } = useAuthTest(`/api/student/${router.query.id}`);

  if (loading)
    return (
      <Layout>
        <Loader /> Loading
      </Layout>
    );

  return (
    <Layout>
      <MentorRequestTable requests={requests} />
    </Layout>
  );
}

import React from "react";
import Layout from "../../components/layout";
import { AppList } from "../../components/MentorAppComponents";
import useAuthTest from "../../hooks/useAuthTest";
import { LoaderWithLayout } from "../../components/Styles";

export default function MentorApplications() {
  const { allApps, reviewerId, loading } = useAuthTest("/api/admin/apps");

  if (loading) return <LoaderWithLayout />;

  return (
    <Layout>
      <AppList allApps={allApps} reviewerId={reviewerId} />
    </Layout>
  );
}

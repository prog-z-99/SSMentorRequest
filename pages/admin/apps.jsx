import React from "react";
import Layout from "../../components/layout";
import { AppList } from "../../components/MentorAppComponents";
import useAuthTest from "../../hooks/useAuthTest";

export default function MentorApplications() {
  const { allApps, reviewerId, loading, notAuth } = useAuthTest(
    "/api/admin/apps",
    true
  );

  return (
    <Layout loading={loading} notAuth={notAuth}>
      <AppList allApps={allApps} reviewerId={reviewerId} />
    </Layout>
  );
}

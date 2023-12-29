import React from "react";
import Layout from "../../components/layout";

import useAuthTest from "../../hooks/useAuthTest";
import { MentorRequestComponent } from "../../components/MentorRequestComponents";

export default function MentorsRequests() {
  const { allRequests, isAdmin, loading, notAuth } = useAuthTest(
    "/api/admin/requests",
    true
  );

  return (
    <Layout loading={loading} notAuth={notAuth}>
      <MentorRequestComponent allRequests={allRequests} isAdmin={isAdmin} />
    </Layout>
  );
}

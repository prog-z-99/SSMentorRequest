import { React } from "react";
import Layout from "../../components/layout";
import { AdminComponent } from "../../components/AdminComponent";
import useAuthTest from "../../hooks/useAuthTest";

export default function Admins() {
  const { users, loading, notAuth } = useAuthTest("/api/admin", true);

  return (
    <Layout loading={loading} notAuth={notAuth}>
      <AdminComponent users={users} />
    </Layout>
  );
}

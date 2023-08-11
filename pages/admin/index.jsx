import { React } from "react";
import Layout from "../../components/layout";
import { AdminComponent } from "../../components/AdminComponent";
import { useAuthTest } from "../../hooks/useAuthTest";
import { Loader } from "@mantine/core";

export default function Admins() {
  const { users, loading } = useAuthTest("/api/admin", true);

  if (loading)
    return (
      <Layout>
        <Loader /> loading
      </Layout>
    );

  return (
    <Layout>
      <AdminComponent users={users} />
    </Layout>
  );
}

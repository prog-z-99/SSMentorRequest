import { Table } from "@mantine/core";
import { React } from "react";
import Layout from "../../components/layout";
import { MentorProfileComponent } from "../../components/MentorListComponents";
import { RequestRow } from "../../components/MentorRequestComponents";
import { useAuthTest } from "../../hooks/useAuthTest";

export default function Mentors() {
  const { mentor, requests, loading, error } = useAuthTest(`/api/mentor`);

  if (loading) return <Layout>loading</Layout>;

  if (error) alert(error);
  return (
    <Layout>
      <MentorProfileComponent mentor={mentor} />
      <Table highlightOnHover striped>
        <tbody>
          {requests?.map((row) => (
            <RequestRow row={row} key={`TableRow${row._id}`} />
          ))}
        </tbody>
      </Table>
    </Layout>
  );
}

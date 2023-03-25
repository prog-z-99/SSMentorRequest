import { Table } from "@mantine/core";
import { getToken } from "next-auth/jwt";
import { React } from "react";
import Layout from "../../components/layout";
import { MentorProfileComponent } from "../../components/MentorListComponents";
import { RequestRow } from "../../components/MentorRequestComponents";
import { getMentorRequests, getUserById } from "../../util/databaseAccess";
import { checkMentor } from "../../util/helper";

export default function Mentors({ user, requests }) {
  return (
    <Layout>
      <MentorProfileComponent mentor={user} />
      <Table highlightOnHover striped>
        <tbody>
          {requests.map((row) => (
            <RequestRow row={row} key={`TableRow${row._id}`} />
          ))}
        </tbody>
      </Table>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const token = await getToken({ req });
  if (!token) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const user = await getUserById(token.sub);
  const fetchRequests = getMentorRequests(user._id);

  if (!checkMentor(user))
    return {
      redirect: {
        destination: "/",
      },
    };

  const requests = await fetchRequests;
  return {
    props: { user, requests },
  };
}

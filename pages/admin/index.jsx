import { React } from "react";
import Layout from "../../components/layout";
import { getAllUsers, isUserAdmin } from "../../util/databaseAccess";
import { AdminComponent } from "../../components/AdminComponent";
import { getToken } from "next-auth/jwt";

export default function Admins({ mentors }) {
  return (
    <Layout>
      <AdminComponent mentors={mentors} />
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const fetchMentors = getAllUsers();
  const token = await getToken({ req });

  if (!token) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const user = await isUserAdmin(token.sub);

  if (!user)
    return {
      redirect: {
        destination: "/",
      },
    };

  const mentors = await fetchMentors;

  return {
    props: { mentors },
  };
}

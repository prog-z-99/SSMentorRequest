import { React, useEffect, useState } from "react";
import Layout from "../../components/layout";
import { isUserAdmin } from "../../util/databaseAccess";
import { AdminComponent } from "../../components/AdminComponent";
import { getToken } from "next-auth/jwt";
import axios from "axios";

export default function Admins() {
  const [mentors, setMentors] = useState([]);
  useEffect(() => {
    axios
      .get("/api/admin")
      .then(({ data }) => setMentors(data))
      .catch((error) => console.log(error));
  }, [setMentors]);

  return (
    <Layout>
      <AdminComponent mentors={mentors} />
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

  const user = await isUserAdmin(token.sub);

  if (!user)
    return {
      redirect: {
        destination: "/",
      },
    };

  return {
    props: {},
  };
}

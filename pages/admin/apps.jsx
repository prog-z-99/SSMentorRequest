import React from "react";
import { getToken } from "next-auth/jwt";
import Layout from "../../components/layout";
import { AppList } from "../../components/MentorAppComponents";
import { isUserReviewer } from "../../util/databaseAccess";

export default function MentorApplications({ reviewerId }) {
  return (
    <Layout>
      <AppList reviewerId={reviewerId} />
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

  const user = await isUserReviewer(token.sub);

  if (!user)
    return {
      redirect: {
        destination: "/",
      },
    };

  return {
    props: { reviewerId: token.sub },
  };
}

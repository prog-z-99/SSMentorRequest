import React from "react";
import { getToken } from "next-auth/jwt";
import Layout from "../../components/layout";
import { AppList } from "../../components/MentorAppComponents";
import { isUserReviewer } from "../../util/databaseAccess";
import { getAllApps } from "../../util/dbaccess/applications";

export default function MentorApplications({ apps, reviewerId }) {
  return (
    <Layout>
      <AppList apps={apps} reviewerId={reviewerId} />
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const fetchApps = getAllApps();
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

  const apps = await fetchApps;

  return {
    props: { apps, reviewerId: token.sub },
  };
}

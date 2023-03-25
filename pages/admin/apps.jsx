import { getToken } from "next-auth/jwt";
import React from "react";
import Layout from "../../components/layout";
import { AppList } from "../../components/MentorAppComponents";
import { getAllApps, isUserReviewer } from "../../util/databaseAccess";

export default function MentorApplications({ apps, reviewerId }) {
  return (
    <Layout>
      <AppList apps={apps} reviewerId={reviewerId} />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const fetchApps = getAllApps();
  const token = await getToken({ req: ctx.req });

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

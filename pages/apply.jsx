import React from "react";
import Layout from "../components/layout";
import MentorForm from "../components/MentorForm";
import { getToken } from "next-auth/jwt";
import { Container } from "@mantine/core";
import { checkPendingApp } from "../util/dbaccess/applications";

export default function Apply({ isRegistered }) {
  let content = (
    <Container>
      <MentorForm />
    </Container>
  );

  if (isRegistered)
    content =
      "We have received your application! Please wait for us to process it.";

  // if (isMentor)
  //   content = (
  //     <>
  //       Mentor already registered! You can head over to{" "}
  //       <Link href="https://ssmentor-request.vercel.app/mentors">
  //         this link
  //       </Link>{" "}
  //       to now see the requests
  //     </>
  //   );

  return <Layout>{content}</Layout>;
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
  const isRegistered = await checkPendingApp(token.sub);

  return {
    props: { isRegistered },
  };
}

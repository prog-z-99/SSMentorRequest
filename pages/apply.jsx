import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import MentorForm from "../components/MentorForm";
import { getToken } from "next-auth/jwt";
import { Container } from "@mantine/core";
import axios from "axios";
import Link from "next/link";

export default function Apply() {
  const [isPending, setIsPending] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  let content = (
    <Container>
      <MentorForm />
    </Container>
  );

  useEffect(() => {
    axios.get("/api/user/application").then(({ data }) => {
      setIsPending(data.isPending);
      setIsMentor(data.isMentor);
    });
  }, []);

  if (isPending)
    content =
      "We have received your application! Please wait for us to process it.";

  if (isMentor)
    content = (
      <>
        Mentor already registered! You can head over to{" "}
        <Link href="https://ssmentor-request.vercel.app/mentors/requests">
          this link
        </Link>{" "}
        to now see the requests
      </>
    );

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

  return {
    props: {},
  };
}

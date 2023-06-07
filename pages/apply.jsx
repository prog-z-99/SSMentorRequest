import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import MentorForm from "../components/MentorForm";
import { Container } from "@mantine/core";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Apply() {
  const { status } = useSession();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [isMentor, setIsMentor] = useState(false);

  let content = <MentorForm />;

  useEffect(() => {
    switch (status) {
      case "unauthenticated":
        router.push("/api/auth/signin");
        break;
      case "authenticated":
        axios.get("/api/user/application").then(({ data }) => {
          setIsPending(data.isPending);
          setIsMentor(data.isMentor);
        });
        break;
    }
  }, [status, router]);

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

  return (
    <Layout>
      <Container>{content}</Container>
    </Layout>
  );
}

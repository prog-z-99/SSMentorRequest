import React, { useState } from "react";
import Layout from "../components/layout";
import MentorForm from "../components/MentorForm";
import { Container } from "@mantine/core";
import Link from "next/link";
import useAuthTest from "../hooks/useAuthTest";

export default function Apply() {
  const { isPending, isMentor } = useAuthTest("/api/user/application");
  const [sent, setSent] = useState(false);

  return (
    <Layout>
      <Container>
        {isPending || sent ? (
          "We have received your application! We will reach you back in a couple of weeks"
        ) : isMentor ? (
          <>
            Mentor already registered! You can head over to{" "}
            <Link href="https://ssmentor-request.vercel.app/mentors/requests">
              this link
            </Link>
            to now see the requests
          </>
        ) : (
          <MentorForm setSent={setSent} />
        )}
      </Container>
    </Layout>
  );
}

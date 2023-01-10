import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Layout from "../components/layout";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import MentorForm from "../components/MentorForm";
import { Button } from "@mantine/core";
import { FormWrapper } from "../components/Styles";

export default function Mentors() {
  const [content, setContent] = useState("");
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  const handleOnClick = async () => {
    const data = (await axios.post("/api/user/mentor", session)).data;
    switch (data) {
      case 0:
        setContent(
          "request has been sent. Be sure to let the Admins know on the server"
        );
        break;
      case 1:
        setContent(
          <>
            Mentor already registered! You can head over to{" "}
            <Link href="https://ssmentor-request.vercel.app/mentors">
              this link
            </Link>{" "}
            to now see the requests
          </>
        );
        break;
      case 2:
        setContent(
          "request has already been sent. We'll get to it when we get to it"
        );
        break;
    }
  };

  useEffect(async () => {
    if (!loading)
      if (!session) {
        router.push("/api/auth/signin");
      }
  }, [loading]);

  return (
    <Layout>
      <FormWrapper>
        {/* <MentorForm /> */}
        <Button onClick={handleOnClick}>Click here to apply for mentor</Button>
        <br />
        <MentorForm />
        {content}
      </FormWrapper>
    </Layout>
  );
}

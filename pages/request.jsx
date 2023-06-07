import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import Terms, { Pending } from "../components/Terms";
import Form from "../components/Form";
import { Container } from "@mantine/core";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();
  const [terms, setTerms] = useState(false);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  let content = <Terms setTerms={setTerms} />;

  useEffect(() => {
    switch (status) {
      case "unauthenticated":
        router.push("/api/auth/signin");
        break;
      case "authenticated":
        axios.get("/api/request").then(({ data }) => {
          setPending(data);
          setLoading(false);
        });
        break;
    }
  }, [status, router]);

  if (pending) content = <Pending />;
  if (terms) content = <Form formLoad={loading} />;

  return (
    <Layout>
      <Container>
        <h1>Mentor Request Form</h1>
        {content}
      </Container>
    </Layout>
  );
}

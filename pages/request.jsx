import React, { useState } from "react";
import Layout from "../components/layout";
import Terms, { Pending } from "../components/Terms";
import RequestForm from "../components/RequestForm";
import { Container } from "@mantine/core";
import useAuthTest from "../hooks/useAuthTest";

export default function Page() {
  const { loading, pending } = useAuthTest("/api/request");

  const [sent, setSent] = useState(pending);
  const [terms, setTerms] = useState(false);

  return (
    <Layout>
      <Container>
        <h1>Mentor Request Form</h1>
        {sent || pending ? (
          <Pending />
        ) : terms ? (
          <RequestForm setSent={setSent} />
        ) : (
          <Terms setTerms={setTerms} loading={loading} />
        )}
      </Container>
    </Layout>
  );
}

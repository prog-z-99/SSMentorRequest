import React, { useState } from "react";
import Layout from "../components/layout";
import Terms, { Pending } from "../components/Terms";
import RequestForm from "../components/RequestForm";
import useAuthTest from "../hooks/useAuthTest";
import { Container } from "@mantine/core";

export default function Page() {
  const { pending, loading, notAuth } = useAuthTest("/api/request");

  const [sent, setSent] = useState(pending);
  const [terms, setTerms] = useState(false);

  let page = <Terms setTerms={setTerms} />;

  if (sent) page = <Pending />;
  else if (terms) page = <RequestForm setSent={setSent} />;

  return (
    <Layout loading={loading} notAuth={notAuth}>
      <Container>{page}</Container>
    </Layout>
  );
}

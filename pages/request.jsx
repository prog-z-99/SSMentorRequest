import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import Terms, { Pending } from "../components/Terms";
import Form from "../components/Form";
import { getToken } from "next-auth/jwt";
import { Container } from "@mantine/core";
import axios from "axios";

export default function Page() {
  const [terms, setTerms] = useState(false);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  let content = <Terms setTerms={setTerms} loading={loading} />;

  useEffect(() => {
    axios.get("/api/request").then(({ data }) => {
      setPending(data);
      setLoading(false);
    });
  }, []);

  if (pending) content = <Pending />;
  if (terms) content = <Form />;

  return (
    <Layout>
      <Container>
        <h1>Mentor Request Form</h1>
        {content}
      </Container>
    </Layout>
  );
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

  return { props: {} };
}

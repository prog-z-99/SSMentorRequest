import React, { useState } from "react";
import Layout from "../components/layout";
import Terms, { Pending } from "../components/Terms";
import Form from "../components/Form";
import { getAllChampions } from "../util/helper";
import { getToken } from "next-auth/jwt";
import { isRequestPending } from "../util/databaseAccess";
import { Container } from "@mantine/core";

export default function Page({ championList, pending }) {
  const [terms, setTerms] = useState(false);
  let content = <Terms setTerms={setTerms} />;

  if (pending) content = <Pending />;
  if (terms) content = <Form championList={championList} />;

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
  const fetchChampionList = getAllChampions();
  const token = await getToken({ req });
  if (!token) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const pending = await isRequestPending(token.sub);
  const championList = await fetchChampionList;
  return { props: { championList, pending } };
}

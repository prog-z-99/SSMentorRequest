import React, { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import Layout from "../components/layout";
import { useRouter } from "next/dist/client/router";
import Terms from "../components/Terms";
import { FormWrapper } from "../components/Styles";
import Form from "../components/Form";

export default function Page({ session }) {
  const [terms, setTerms] = useState(false);
  const [content, setContent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!terms) setContent(<Terms setTerms={setTerms} />);
    else setContent(<Form />);
  }, [terms]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined") {
    if (!session) {
      router.push("/api/auth/signin");
      return null;
    }
  }

  return (
    <Layout>
      <h1>Mentor Request Form</h1>
      <FormWrapper>{content}</FormWrapper>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}

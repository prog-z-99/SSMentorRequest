import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import Layout from "../components/layout";
import Terms, { Pending } from "../components/Terms";
import { FormWrapper } from "../components/Styles";
import axios from "axios";
import Form from "../components/Form";

export default function Page() {
  const [terms, setTerms] = useState(false);
  const [content, setContent] = useState(null);
  const [session, loading] = useSession();
  const [requestPending, setRequestPending] = useState(false);

  useEffect(async () => {
    if (!loading)
      if (!session) {
        router.push("/api/auth/signin");
      } else {
        setRequestPending((await axios.post("/api/request", session)).data);
      }
  }, [loading]);

  useEffect(() => {
    if (requestPending) setContent(<Pending />);
    else if (!terms) setContent(<Terms setTerms={setTerms} />);
    else setContent(<Form />);
  }, [requestPending, terms]);

  return (
    <Layout>
      <FormWrapper>
        <h1>Mentor Request Form</h1>
        {content}
      </FormWrapper>
    </Layout>
  );
}

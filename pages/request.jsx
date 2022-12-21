import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import Layout from "../components/layout";
import Terms, { Pending } from "../components/Terms";
import { FormWrapper } from "../components/Styles";
import axios from "axios";
import Form from "../components/Form";
import { useRouter } from "next/router";
import { getAllChampions } from "../util/helper";

export default function Page({ championList }) {
  const [terms, setTerms] = useState(false);
  const [content, setContent] = useState(null);
  const [session, loading] = useSession();
  const [requestPending, setRequestPending] = useState(false);

  async function sendMentorRequest(values) {
    await axios
      .post("/api/request/create", { session, values })
      .then(() => {
        alert("Request has been sent!");
        router.push("/");
      })
      .catch((error) => {
        alert(
          "Error. Please check your form. If this issue persists, please contact the Mod team"
        );
      });
  }

  const router = useRouter();

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
    else
      setContent(
        <Form
          championList={championList}
          sendMentorRequest={sendMentorRequest}
        />
      );
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

export async function getStaticProps(context) {
  const championList = await getAllChampions();

  return { props: { championList } };
}

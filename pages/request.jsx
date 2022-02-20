import React, { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/client";
import Layout from "../components/layout";
import { connectToDatabase } from "../util/mongodb";
import { useRouter } from "next/dist/client/router";
import Terms, { Pending } from "../components/Terms";
import { FormWrapper } from "../components/Styles";
import Form from "../components/Form";
import Request from "../models/requestModel";

export default function Page({ requestPending, session }) {
  const [terms, setTerms] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (requestPending) setContent(<Pending />);
    else if (!terms) setContent(<Terms setTerms={setTerms} />);
    else setContent(<Form />);
  }, [terms]);

  return (
    <Layout>
      <FormWrapper>
        <h1>Mentor Request Form</h1>
        {content}
      </FormWrapper>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
    };
  }
  await connectToDatabase();

  const request = await Request.findOne({ discordId: session.user.id });
  if (request) {
    if (!request.completed || wasMonthAgo(request.completed)) {
      return {
        props: {
          session,
          requestPending: true,
        },
      };
    }
  }
  return {
    props: {
      session,
    },
  };
}

function wasMonthAgo(completed) {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const then = new Date(completed);
  return monthAgo < then;
}

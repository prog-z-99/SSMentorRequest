import React, { useState } from "react";
import Layout from "../components/layout";
import MentorForm from "../components/MentorForm";
import Link from "next/link";
import useAuthTest from "../hooks/useAuthTest";

export default function Apply() {
  const { isPending, isMentor, loading, notAuth } = useAuthTest(
    "/api/user/application"
  );
  const [sent, setSent] = useState(false);

  let page = <MentorForm setSent={setSent} />;

  if (isPending)
    page = "We have received your application! We will reach you back soon";
  else if (sent)
    page =
      "Thank you for you application! We will reach back to you in a couple of weeks";
  else if (isMentor)
    page = (
      <>
        Mentor already registered! You can head over to{" "}
        <Link href="https://ssmentor-request.vercel.app/mentors/requests">
          this link
        </Link>
        to now see the requests
      </>
    );

  return (
    <Layout loading={loading} notAuth={notAuth}>
      {page}
    </Layout>
  );
}

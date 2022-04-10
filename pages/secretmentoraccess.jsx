import axios from "axios";
import { useSession } from "next-auth/client";
import { useState, useEffect } from "react";
import Layout from "../components/layout";
import Link from "next/link";

export default function Mentors() {
  const [content, setContent] = useState("Loading...");
  const [session, loading] = useSession();

  useEffect(async () => {
    if (!loading)
      if (!session) {
        router.push("/api/auth/signin");
      } else {
        const data = (await axios.post("/api/user/mentor", session)).data;
        switch (data) {
          case 0:
            setContent(
              "request has been sent. Be sure to let the Admins know on the server"
            );
            break;
          case 1:
            setContent(
              <>
                Mentor registered! You can head over to{" "}
                <Link href="https://ssmentor-request.vercel.app/mentors">
                  this link
                </Link>{" "}
                to now see the requests
              </>
            );
            break;
          case 2:
            setContent(
              "request has already been sent. We'll get to it when we get to it"
            );
        }
      }
  }, [loading]);

  return <Layout>{content}</Layout>;
}

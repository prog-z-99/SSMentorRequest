import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import { checkAdmin } from "../../util/helper";
import { getAllMentors } from "../../util/databaseAccess";
import { AdminComponent } from "../../components/AdminComponent";

export default function Admins({ mentors }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [content, setContent] = useState("loading");
  useEffect(async () => {
    if (!loading)
      if (!session) {
        router.push("/api/auth/signin");
      } else {
        await axios.post("/api/user", session).then((response) => {
          if (checkAdmin(response.data))
            setContent(<AdminComponent mentors={mentors} />);
          else router.push("/");
        });
      }
  }, [loading]);
  return <Layout>{content}</Layout>;
}

export async function getServerSideProps(context) {
  // const requests = await getAllRequests();
  const mentors = await getAllMentors();
  return {
    props: { mentors },
  };
}

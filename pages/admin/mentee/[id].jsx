import { useState, useEffect, React } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Layout from "../../../components/layout";
import { useRouter } from "next/router";
import { checkAdmin } from "../../../util/helper";
import { getMenteeRequestsByDiscordId } from "../../../util/databaseAccess";

export default function MenteeById({ details: { mentor, requests } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [content, setContent] = useState("loading");
  useEffect(() => {
    const fetchData = async () => {
      if (!loading) {
        if (!session) {
          router.push("/api/auth/signin");
        } else {
          await axios.post("/api/user", session).then((response) => {
            if (checkAdmin(response.data)) setContent();
          });
        }
      }
    };
    fetchData();
  }, [loading]);
  return <Layout>{content}</Layout>;
}

export async function getServerSideProps({ params }) {
  const requests = await getMenteeRequestsByDiscordId(params.id);
  return {
    props: { requests },
  };
}

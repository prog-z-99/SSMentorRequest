import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import axios from "axios";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import { checkAdmin } from "../../util/helper";
import { getMentorRequests, getAllMentors } from "../../util/databaseAccess";
import { MentorDetails } from "../../components/AdminComponent";

export default function MentorById({ requests }) {
  const router = useRouter();
  const [session, loading] = useSession();
  const [content, setContent] = useState("loading");
  useEffect(async () => {
    if (!loading)
      if (!session) {
        router.push("/api/auth/signin");
      } else {
        await axios.post("/api/user", session).then((response) => {
          if (checkAdmin(response.data))
            setContent(
              <MentorDetails
                mentor={"I will have their name appear here"}
                requests={requests}
              />
            );
        });
      }
  }, [loading]);
  return <Layout>{content}</Layout>;
}

export async function getStaticProps({ params }) {
  const requests = await getMentorRequests(params.id);
  return {
    props: { requests },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const mentors = await getAllMentors();

  const paths = mentors.map((mentor) => ({ params: { id: mentor._id } }));

  return {
    paths,
    fallback: "blocking",
  };
}

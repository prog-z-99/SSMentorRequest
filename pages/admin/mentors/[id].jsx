import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Layout from "../../../components/layout";
import { useRouter } from "next/router";
import { checkAdmin } from "../../../util/helper";
import { getMentorRequests, getAllMentors } from "../../../util/databaseAccess";
import { MentorDetails } from "../../../components/AdminComponent";

export default function MentorById({ details }) {
  const router = useRouter();
  const { data: session, status } = useSession()
const loading = status === "loading";
  const [content, setContent] = useState("loading");
  useEffect(async () => {
    if (!loading)
      if (!session) {
        router.push("/api/auth/signin");
      } else {
        await axios.post("/api/user", session).then((response) => {
          if (checkAdmin(response.data))
            setContent(<MentorDetails props={...details} />);
        });
      }
  }, [loading]);
  return <Layout>{content}</Layout>;
}

export async function getServerSideProps({ params }) {
  const details = await getMentorRequests(params.id);
  return {
    props: { details },
  };
}

// export async function getStaticPaths() {
//   const mentors = await getAllMentors();

//   const paths = mentors.map((mentor) => ({ params: { id: mentor._id } }));

//   return {
//     paths,
//     fallback: "blocking",
//   };
// }

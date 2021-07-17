import { getSession } from "next-auth/client";
import { connectToDatabase } from "../util/mongodb";
import User from "../models/userModel";
import Layout from "../components/layout";

export default function Admins({ content }) {
  return <Layout>{content}</Layout>;
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

  const user = await User.findOne({ discordId: session.user.id });

  if (!user || user.userType != "admin" || user.userType != "god")
    return {
      redirect: {
        destination: "/",
      },
    };

  return {
    props: {
      content: "welcum",
    },
  };
}

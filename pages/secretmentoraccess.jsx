import { getSession } from "next-auth/client";
import { connectToDatabase } from "../util/mongodb";
import User from "../models/userModel";
import Layout from "../components/layout";

export default function Mentors({ content }) {
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

  if (!user) {
    const newUser = new User({
      discordName: `${session.user.name}#${session.user.discriminator}`,
      discordId: session.user.id,
    });
    await newUser.save();
    return {
      props: {
        content: "request has been sent. Admins will look into this",
      },
    };
  }

  return {
    props: {
      content: "request already sent. calm down",
    },
  };
}

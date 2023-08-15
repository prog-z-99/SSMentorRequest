import { React } from "react";
import Layout from "../../components/layout";
import { MentorList } from "../../components/MentorListComponents";
import { cleaner } from "../../util/helper";
import { getAllMentors } from "../../util/dbaccess/userMethods";
import dbConnect from "../../util/mongodb";

export default function Mentors({ mentors }) {
  return (
    <Layout>
      <MentorList mentors={mentors} />
    </Layout>
  );
}

export async function getStaticProps() {
  await dbConnect();
  const mentors = await getAllMentors();

  return {
    props: { mentors: cleaner(mentors) },
    revalidate: 5,
  };
}

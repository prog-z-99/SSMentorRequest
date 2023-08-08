import { React } from "react";
import Layout from "../../components/layout";
import { getAllMentors } from "../../util/databaseAccess";
import { MentorList } from "../../components/MentorListComponents";
import { cleaner } from "../../util/helper";

export default function Mentors({ mentors }) {
  return (
    <Layout>
      <MentorList mentors={mentors} />
    </Layout>
  );
}

export async function getStaticProps() {
  const mentors = await getAllMentors();

  return {
    props: { mentors: cleaner(mentors) },
    revalidate: 60,
  };
}

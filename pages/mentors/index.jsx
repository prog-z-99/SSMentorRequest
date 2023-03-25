import { React } from "react";
import Layout from "../../components/layout";
import { getAllMentors } from "../../util/databaseAccess";
import { MentorList } from "../../components/MentorListComponents";

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
    props: { mentors },
    revalidate: 1, //TODO should be 6000 on the next update
  };
}

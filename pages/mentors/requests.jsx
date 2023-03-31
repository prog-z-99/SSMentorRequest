import React, { useState, useEffect } from "react";
import Layout from "../../components/layout";
import { Text, Tabs } from "@mantine/core";
import axios from "axios";
import { checkAdmin, checkStaff } from "../../util/helper";
import { getToken } from "next-auth/jwt";
import { getUserById } from "../../util/databaseAccess";
import { MentorRequestTable } from "../../components/MentorRequestComponents";

//TODO use useTransition for cleaner updates

export default function Mentors({ isAdmin }) {
  const [requests, setRequests] = useState([]);
  const [requestsPile, setRequestsPile] = useState({});

  useEffect(() => {
    axios.get("/api/request").then(({ data }) => setRequests(data));
  }, []);

  const onTabChange = (value) => {
    if (requestsPile[value]) {
      setRequests(requestsPile[value]);
    } else
      axios.put("/api/request", { type: value }).then(({ data }) => {
        requestsPile[value] = data;
        setRequestsPile(requestsPile);
        setRequests(data);
      });
  };

  return (
    <Layout>
      <Tabs onTabChange={onTabChange}>
        <Tabs.List>
          <Tabs.Tab value="Not Accepted">Not Accepted</Tabs.Tab>
          <Tabs.Tab value="In-Progress">In-Progress</Tabs.Tab>
          <Tabs.Tab value="Completed">Completed</Tabs.Tab>
          <Tabs.Tab value="Problem">Problem</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      {requests.length == 0 ? (
        <Text> loading requests </Text>
      ) : (
        <MentorRequestTable
          isAdmin={isAdmin}
          requests={requests}
          setRequests={setRequests}
        />
      )}
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const token = await getToken({ req });
  if (!token) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const user = await getUserById(token.sub);
  const isAdmin = checkAdmin(user);
  const isMentor = checkStaff(user);

  if (!user || !isMentor)
    return {
      redirect: {
        destination: "/",
      },
    };

  return {
    props: { isAdmin },
  };
}

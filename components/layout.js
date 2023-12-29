import Header from "../components/header";
import Footer from "../components/footer";
import React from "react";
import Head from "next/head";
import { AppShell, Loader } from "@mantine/core";
import AccessDenied from "./access-denied";

export default function Layout({ loading, notAuth, children }) {
  return (
    <AppShell header={<Header />} footer={<Footer />}>
      <Head>
        <title>Summoner School Mentor Requests</title>
      </Head>

      {loading ? (
        <>
          <Loader /> loading
        </>
      ) : notAuth ? (
        <AccessDenied />
      ) : (
        children
      )}
    </AppShell>
  );
}

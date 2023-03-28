import Header from "../components/header";
import Footer from "../components/footer";
import React from "react";
import Head from "next/head";
import { AppShell } from "@mantine/core";

export default function Layout({ children }) {
  return (
    <AppShell>
      <Header />
      <Head>
        <title>Summoner School Mentor Requests</title>
      </Head>
      {children}
      <Footer />
    </AppShell>
  );
}

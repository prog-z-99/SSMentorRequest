import Header from "../components/header";
import Footer from "../components/footer";
import React from "react";
import { PageWrapper } from "./Styles";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <PageWrapper>
      <Head>
        <title>Summoner School Mentor Requests</title>
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </PageWrapper>
  );
}

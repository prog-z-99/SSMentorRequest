import Head from "next/head";
import Link from "next/link";
import React from "react";
import dbConnect from "../util/mongodb";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Summoner School Mentor Requests</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to{" "}
          <a href="https://discord.gg/summonerschool">Summoner School</a>{" "}
          Discord Mentor Request Site
        </h1>

        <div className="grid">
          <Link href="/request">
            <div className="card">
              <h3>Make a new request &rarr;</h3>
              <p>Fill out a new mentor request</p>
            </div>
          </Link>
          <Link href="/apply">
            <div className="card">
              <h3>Apply to become mentor &rarr;</h3>
              <p>Join the Summoner School team</p>
            </div>
          </Link>
          <Link href="/mentors">
            <div className="card">
              <h3>Mentor list &rarr;</h3>
              <p>See the mentoring team</p>
            </div>
          </Link>
        </div>
      </main>

      <style>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          /* padding: 5rem 0; */
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  await dbConnect();
  return { props: {} };
}

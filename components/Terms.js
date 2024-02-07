import { Title, Text, Button, Space, Checkbox } from "@mantine/core";
import React, { useState } from "react";

export default function Terms({ setTerms }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Text size="sm">
      <Title>Mentor Request</Title>
      <div className="terms">
        {process.env.NEXT_PUBLIC_REQUEST_STATUS == "closed" && <Closed />}
        <p>Welcome to the Summoner School Discord’s mentor request system!</p>
        <p>
          Our mentors are here to help those who are serious about improving
          their gameplay and do that primarily through VOD reviews. The aim of
          mentoring is to provide you, the student, with general directions and
          learning objectives. If you meet the minimum requirements for a VOD
          review, a mentor will be reaching out to you through DMs. Please
          remember this is a free, volunteer-based service and wait times may
          vary depending on your rank, position, timezone, and mentor
          availability.
        </p>
        <p>
          If you are new or do not meet the requirements below but are still
          looking for a vod review, please use the #vod-review channel for a
          community review (check the pins for how to get started). Any other
          gameplay questions can be posted in any of the educational channels.
        </p>
        <Title size="h4">Minimum Requirements:</Title>
        <ul>
          <li>It has been 30 days since your last fulfilled mentor request</li>
          <li>
            You have{" "}
            <Text span fs="italic">
              at least
            </Text>{" "}
            75 total ranked solo/duo queue games played during this current
            split
          </li>
          <li>
            You have{" "}
            <Text span fs="italic">
              at least
            </Text>{" "}
            25 ranked games played on the champion in the VOD you submit
          </li>
        </ul>
        <Space h="lg" />
        <Title size="h4">How to prepare for mentoring?</Title>
        <Text>
          We encourage you to consider a game that is representative of YOUR
          average solo queue experience. Before submitting a game, review it
          briefly to understand what went wrong or well. Identify major
          weaknesses and areas for improvement. Focus on overarching habits and
          general gameplay, not specific details. Ask yourself things like
          &#34;Do I keep dying to jungler ganks?&#34; or &#34;Do my waves
          somehow end up in bad positions?&#34; Come up with some questions to
          ask your mentor so you can get the most out of the session.
        </Text>
        <p>
          <Text>
            <Text span td="underline" fs="italic">
              Note
            </Text>
            : Mentors may deny a review request if you do not meet the minimum
            requirements. Exceptions can be made for very active players at the
            start of the split.
          </Text>
        </p>
        {process.env.NEXT_PUBLIC_REQUEST_STATUS != "closed" && (
          <>
            <Checkbox
              label="I have read and understand all of the
          above."
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <Space h="lg" />
            <Button disabled={!isChecked} onClick={() => setTerms(true)}>
              Continue
            </Button>
          </>
        )}
      </div>
    </Text>
  );
}

export function Pending() {
  return (
    <Text>
      <p>
        Request has been sent! Our mentors will reach out to you soon, so please
        make sure to have your DMs open for our mentors to reach you!
      </p>

      <p>
        If you have recently finished a review and would like to send another,
        please note that there is a limit of 1 request per month. Please note
        that if we were not able to reach you for your previous request, you
        will be able to send your next request after 3 months.
      </p>
    </Text>
  );
}

export function Closed() {
  return (
    <Text>
      <h1>
        We have closed our mentor request in preparation for the new season! We
        will be coming back about one month after the start of the new season,
        around late January ~ early February, so make sure to meet the
        requirements if you wish to make a mentor request when we re-open!
      </h1>
    </Text>
  );
}

import { Button } from "@mantine/core";
import React from "react";

export default function Terms({ setTerms }) {
  return (
    <div className="terms">
      <p>
        Welcome to the Summoner School Discord’s mentor request system! Our mentors are here to help those who are serious about improvement, so please read the following carefully on how to qualify for a VOD review.
      </p>
      <p>
        <b><u>Requirements to request a VOD Review:</u></b>
        <ul>
          <li>You must have at least 75 total ranked games played during this current split</li>
          <li>You must have a minimum of 25 ranked games on the champion in the VOD you submit</li>
          <li>The VOD you send must be a Solo/Duo Queue game that is a reasonably close game (no one-sided stomps)</li>
        </ul>
      </p>
      <p>
        <b><u>NOTE</u></b>:  Mentors may choose to deny a review request if you do not meet the above requirements. You may only request a VOD review once every 30 days from your last fulfilled request.
      </p>
      <p>
        This is a free, volunteer-based service. Wait times may be longer depending on your rank, position, or timezone. If you are new or do not meet the requirements above, you can ask questions in any of our Discord’s role-specific chats or use #vod-review for a community review (check the pins for details).
      </p>
      <Button onClick={() => setTerms(true)}>
        By clicking this box, I acknowledge that I have read all of the
        above.
      </Button>
    </div>
  );
}

export function Pending() {
  return (
    <p>
      Sorry, either your request is currently pending, or it hasn&apos;t been
      long since your last session was finished.
    </p>
  );
}

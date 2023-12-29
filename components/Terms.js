import { Button } from "@mantine/core";
import React from "react";

export default function Terms({ setTerms }) {
  return (
    <div className="terms">
      {process.env.NEXT_PUBLIC_REQUEST_STATUS == "closed" && <Closed />}
      <p>
        Welcome to the Summoner School Discord’s mentor request system! Our
        mentors are here to help those who are serious about improvement, so
        please read the following carefully on how to qualify for a VOD review.
      </p>

      <b>
        <u>Requirements to request a VOD Review:</u>
      </b>
      <ul>
        <li>
          You must have at least 75 total ranked games played during this
          current split
        </li>
        <li>
          You must have a minimum of 25 ranked games on the champion in the VOD
          you submit
        </li>
        <li>
          The VOD you send must be a Solo/Duo Queue game that is a reasonably
          close game (no one-sided stomps)
        </li>
      </ul>

      <p>
        <b>
          <u>NOTE</u>
        </b>
        : Mentors may choose to deny a review request if you do not meet the
        above requirements. Exceptions can be made for very active players at
        the start of the split. You may only request a VOD review once every 30
        days from your last fulfilled request.
      </p>
      <p>
        This is a free, volunteer-based service. Wait times may be longer
        depending on your rank, position, or timezone. If you are new or do not
        meet the requirements above, you can ask questions in any of our
        Discord’s role-specific chats or use #vod-review for a community review
        (check the pins for details).
      </p>

      {process.env.NEXT_PUBLIC_REQUEST_STATUS != "closed" && (
        <Button onClick={() => setTerms(true)}>
          By clicking this box, I acknowledge that I have read all of the above.
        </Button>
      )}
    </div>
  );
}

export function Pending() {
  return (
    <>
      <p>
        Request has been sent! Please make sure to have your DMs open for our
        mentors to reach you!
      </p>

      <p>
        If you have recently finished a review and would like to send another,
        please note that there is a limit of 1 request per month.
      </p>
    </>
  );
}

export function Closed() {
  return (
    <div>
      <h1>
        We have closed our mentor request in preparation for the new season! We
        will be coming back 1 month after the start of the new season, on
        February 10th, so make sure to meet the requirements if you wish to make
        a mentor request when we re-open!
      </h1>
    </div>
  );
}

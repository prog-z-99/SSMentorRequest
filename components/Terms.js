import { Button } from "@mantine/core";

export default function Terms({ setTerms }) {
  return (
    <>
      <p>
        Welcome to the Summonerschool Discord Mentor Request System! Through
        this form you can request an <a href="https://op.gg">OP.GG</a> review, a
        1 on 1 session, or a VOD review. You cannot submit multiple tickets at
        once, although you can submit a new ticket 2 weeks after your prior one
        was completed, one month for VODs. We ask that you please read
        everything below should they apply to the type of ticket you request.
        Afterwards, use the google form linked directly below to request a
        session. Please remember that this is a free, volunteer-based service
        and wait times may be longer depending on your rank/timezone.
      </p>
      <p>
        --- If you plan on requesting an OP.GG review --- <br />
        Check out <a href="https://redd.it/6j4e5g"> this link</a> first to
        self-evaluate the common mistakes. Once you're done with this, if you
        still have questions or concerns, request a review. If you plan on
        requesting an <a href="https://op.gg">OP.GG</a> review, you do not need
        to read further.
      </p>
      <p>
        --- If you plan on requesting a 1 on 1 session --- <br />
        Please prepare material to go over with your mentor beforehand. This can
        range to anything from general questions about topics, to clips of games
        (normal, flex or ranked queue clips - must be under 10 minutes) for a
        short review - anything that can be done in a 1 on 1 session that is not
        an long/intensive VOD review. If you plan on requesting this, you do not
        need to read further.
      </p>
      <p>
        --- If you plan on requesting a VOD review --- <br />
        Please read all of the below text. VOD/Replay Reviews are for those
        serious about improvement and will require a prearranged appointment to
        go through all the material. VODs are only accepted by the mentor's
        discretion, so VOD reviews may have longer wait times. Requirements to
        request a VOD: - Must be Solo/Duo Queue only (Normal/Flex clips (not
        full games) are accepted via the 1v1 session) - Must have at least 10
        ranked games on the champion being played this season - Must have at
        least 25 total ranked games played this season - Must be a fairly close
        game - no one-sided stomps - Must be serious about improvement
      </p>
      <Button variant="outlined" onClick={() => setTerms(true)}>
        By clicking this box, you acknowledge that you have read all of the
        above.
      </Button>
    </>
  );
}

export function Pending() {
  return (
    <p>
      Sorry, either your request is currently pending, or it hasn't been long
      since your last session was finished.
    </p>
  );
}

import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";

export const AdminComponent = ({ mentors }) => {
  return (
    <MentorsWrapper>
      {mentors.map((mentor, i) => (
        <Link href={`/secretadminaccess/${mentor._id}`}>
          <MentorObject key={`mentorNo${i}`}>{mentor.discordName}</MentorObject>
        </Link>
      ))}
    </MentorsWrapper>
  );
};

export const MentorDetails = ({ mentor, requests }) => {
  return (
    <MentorsWrapper>
      {mentor.discordName}
      {requests?.map((request) => (
        <div>
          {request.status} {moment(request.accepted).format("l")}{" "}
          {request.completed ? moment(request.completed).format("l") : ""}
        </div>
      ))}
    </MentorsWrapper>
  );
};

const MentorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const MentorObject = styled.div``;

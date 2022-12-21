import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { Select, Table } from "@mantine/core";
import { userSelectCommand, userType } from "../util/datalist";
import axios from "axios";

export const AdminComponent = ({ mentors }) => {
  return (
    <MentorsWrapper>
      <Table striped>
        <tbody>
          {mentors.map((mentor, i) => (
            <tr>
              <td>
                <Link href={`/secretadminaccess/${mentor._id}`}>
                  <a key={`mentorNo${i}`}>{mentor.discordName}</a>
                </Link>
              </td>
              <td>
                <UserTypeSelect user={mentor} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </MentorsWrapper>
  );
};

const UserTypeSelect = ({ user }) => {
  const handleOnChange = async (value) => {
    const { data } = await axios.put("api/admin", {
      userID: user._id,
      command: userSelectCommand(value),
    });
  };
  return (
    <Select
      defaultValue={user.userType}
      data={userType.slice(0, 3)}
      onChange={handleOnChange}
    />
  );
};

export const MentorDetails = ({ mentor, requests }) => {
  return (
    <MentorsWrapper>
      {mentor.discordName}
      <Table striped>
        <thead>
          <tr>
            <th>Request Status</th>
            <th>Accepted Date</th>
            <th>Completed Date</th>
            <th>Mentee tag</th>
            <th>Mentee ID</th>
          </tr>
        </thead>
        <tbody>
          {requests?.map((request, i) => {
            console.log(dayjs(request.accepted).format("L"));
            return (
              <tr key={`TableRow${i}`}>
                <td>{request.status}</td>
                <td>{dayjs(request.accepted).format("L")}</td>
                <td>
                  {request.completed
                    ? dayjs(request.completed).format("L")
                    : ""}
                </td>
                <td>{request.discordName}</td>
                <td>{request.discordId}</td>
                <td>{request.remarks}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </MentorsWrapper>
  );
};

const MentorsWrapper = styled.div`
  display: table;
  flex-direction: column;
  fill: 100%;
`;

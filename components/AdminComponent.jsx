import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import { Button, Select, Switch, Table } from "@mantine/core";
import { fullRanks, userSelectCommand } from "../util/datalist";
import axios from "axios";
import { MentorsWrapper } from "./Styles";

export const AdminComponent = ({ mentors }) => {
  return (
    <MentorsWrapper>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Mentor Name</th>
            <th>Last completed</th>
            <th>Last taken</th>
            <th>Toggle mentor</th>
            <th>Toggle admin</th>
            <th>Toggle reviewer</th>
            <th>Peak Rank</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {mentors.map((mentor, i) => (
            <tr key={`Row${i}`}>
              <td>
                <Link
                  href={`/admin/mentors/${mentor.discordId}`}
                  key={`mentorNo${i}`}
                >
                  {mentor.discordName}
                </Link>
              </td>
              <td>
                {mentor.lastCompleted
                  ? dayjs(mentor.lastCompleted).format("DD / MMM / YYYY")
                  : ""}
              </td>
              <td>
                {mentor.lastTaken
                  ? dayjs(mentor.lastTaken).format("DD / MMM / YYYY")
                  : ""}
              </td>

              <td>
                <UserTypeUpdate
                  user={mentor}
                  type={"mentor"}
                  defChecked={mentor.isMentor}
                />
              </td>
              <td>
                <UserTypeUpdate
                  user={mentor}
                  type={"admin"}
                  defChecked={mentor.isAdmin}
                />
              </td>
              <td>
                <UserTypeUpdate
                  user={mentor}
                  type={"reviewer"}
                  defChecked={mentor.isReviewer}
                />
              </td>
              <td>
                <UserRankSelect user={mentor} />
              </td>
              <td>
                <Button onClick={() => DeleteUser(mentor)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </MentorsWrapper>
  );
};

const DeleteUser = async (user) => {
  if (confirm("Are you ABSOLUTELY sure you want to delete this user?")) {
    axios.post("api/admin", { user: user._id }).then(({ data }) => alert(data));
  } else console.log("not");
};

const UserRankSelect = ({ user }) => {
  const handleOnChange = async (value) => {
    axios.put("api/admin", {
      userId: user._id,
      command: userSelectCommand("PEAKRANK"),
      rank: value,
    });
  };
  return (
    <Select
      defaultValue={user.peakRank}
      data={fullRanks()}
      onChange={handleOnChange}
    />
  );
};

const UserTypeUpdate = ({ user, type, defChecked }) => {
  const handleSwitchUpdate = async ({ currentTarget: { checked } }) => {
    axios
      .put("api/admin", {
        userId: user._id,
        command: userSelectCommand(type),
        bool: checked,
      })
      .then(({ data }) => console.log(data));
  };
  return (
    <Switch
      aria-label={type}
      defaultChecked={defChecked}
      onChange={handleSwitchUpdate}
    />
  );
};

// const UserTypeSelect = ({ user }) => {
//   const handleOnChange = async (value) => {
//     const { data } = await axios.put("api/admin", {
//       userID: user._id,
//       command: userSelectCommand(value),
//     });
//     console.log(data);
//   };
//   return (
//     <Select
//       defaultValue={user.userType}
//       data={userType.slice(0, 3)}
//       onChange={handleOnChange}
//     />
//   );
// };

// export const MentorDetails = ({ mentor, requests }) => {
//   return (
//     <MentorsWrapper>
//       {mentor.discordName}
//       <Table striped>
//         <thead>
//           <tr>
//             <th>Request Status</th>
//             <th>Accepted Date</th>
//             <th>Completed Date</th>
//             <th>Mentee tag</th>
//             <th>Mentee ID</th>
//             <th>Remark</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests?.map((request, i) => (
//             <tr key={`TableRow${i}`}>
//               <td>{request.status}</td>
//               <td>{dayjs(request.accepted).format("L")}</td>
//               <td>
//                 {request.completed ? dayjs(request.completed).format("L") : ""}
//               </td>
//               <td>{request.discordName}</td>
//               <td>{request.discordId}</td>
//               <td>{request.remarks}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </MentorsWrapper>
//   );
// };

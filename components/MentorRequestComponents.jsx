import React, { useState } from "react";
import {
  // getStatusColor,
  Remarks,
  getStatusIcon,
  ClickToCopy,
} from "./Styles";
import dayjs from "dayjs";
import { copyClip } from "../util/helper";
import { Button, Container, Select, Text } from "@mantine/core";
import axios from "axios";
import { statuses } from "../util/datalist";

export const RequestRow = ({ row, isAdmin }) => {
  const [rowOpen, setRowOpen] = useState(false);

  return (
    <>
      <tr>
        <td>
          <Button onClick={() => setRowOpen((o) => !o)}>Details</Button>
        </td>
        <td>{dayjs(row.createdAt).format("l")}</td>
        <td
          onClick={() => {
            copyClip(row.discordName);
          }}
        >
          <ClickToCopy>{row.discordName}</ClickToCopy>
        </td>
        <td>
          <a
            href={`https://${row.region}.op.gg/summoner/userName=${row.summonerName}`}
            rel={"noreferrer"}
            target={"_blank"}
          >
            {row.summonerName}
          </a>
        </td>
        <td>{row.rank}</td>
        <td>{row.region}</td>
        <td>{row.role}</td>
        <td>
          {typeof row.champions == "string"
            ? row.champions
            : row.champions?.join(", ")}
        </td>
        <td>{row.timezone}</td>
        <td>
          <TableSelect request={row} />
        </td>
      </tr>
      {rowOpen && (
        <tr>
          <td colSpan={12}>
            <Details item={row} isAdmin={isAdmin} />
          </td>
        </tr>
      )}
    </>
  );
};

const Details = ({ item, isAdmin }) => {
  const { _id } = item;

  const handleArchive = () => {
    if (confirm("Are you sure you want to archive this request?")) {
      axios.put("/api/request/change", { _id, type: "archive" });
    } else console.log("not");
  };
  const handleDelete = () => {
    if (confirm("Are you ABSOLUTELY sure you want to delete this request?")) {
      axios
        .delete(`/api/request/${_id}`)
        .then(({ data }) => alert(data))
        .catch(() =>
          alert("Something didn't work. Notify Z if the request is not deleted")
        );
    } else console.log("not");
  };
  return (
    <Container fluid>
      <Text>Notes: {item.info} </Text>
      {item.accepted && (
        <>
          <Text>Accepted At: {dayjs(item.accepted).format("l")}</Text>
          <Text>Accepted Mentor: {item.mentor.discordName}</Text>
        </>
      )}
      {item.completed && (
        <Text>Completed At: {dayjs(item.completed).format("l")}</Text>
      )}
      <ClickToCopy>Discord ID: {item.discordId}</ClickToCopy>

      <Remarks id={_id} content={item.remarks} />
      <br />
      <>
        <Button onClick={handleArchive}>ARCHIVE THIS REQUEST</Button>
        {isAdmin && <Button onClick={handleDelete}>DELETE THIS REQUEST</Button>}
      </>
    </Container>
  );
};

const TableSelect = ({ request }) => {
  const handleStatusChange = (value) => {
    axios
      .put(`/api/request/${request._id}`, { value, type: "status" })
      .then(({ data }) => {
        alert(data);
      })
      .catch(() => {
        alert("error, some shit gone wrong. nag Z about this");
      });
  };
  return (
    <Select
      data={statuses}
      icon={getStatusIcon(request.status)}
      defaultValue={request.status}
      onChange={handleStatusChange}
    />
  );
};

export const TableHeader = ({ header, setRequests, requests }) => {
  const { title, sorter } = header;

  const [asc, setAsc] = useState(false);
  // const ascSort = useMemo(
  //   () => sortRequests({ requests, sorter, reverse: true }),
  //   [sorter, requests]
  // );
  // const descSort = useMemo(
  //   () => sortRequests({ requests, sorter, reverse: false }),
  //   [sorter, requests]
  // );

  if (!sorter) {
    return <th>{title}</th>;
  }

  const handleClick = () => {
    setRequests(sortRequests({ requests, sorter, reverse: asc }));
    setAsc(!asc);
  };

  return (
    <th>
      <Button onClick={() => handleClick()}>{header.title}</Button>
    </th>
  );
};

const sortRequests = ({ requests, reverse, sorter }) => {
  if (!sorter) return;
  return [...requests.sort((a, b) => sorter(reverse ? b : a, reverse ? a : b))];
};

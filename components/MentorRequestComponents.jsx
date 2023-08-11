import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  // getStatusColor,
  getStatusIcon,
  ClickToCopy,
  StyledClickableContainer,
  StyledLabel
} from "./Styles";
import dayjs from "dayjs";
import {
  Table,
  Button,
  Container,
  Select,
  Text,
  Textarea,
  SimpleGrid,
  Space,
  Box,
} from "@mantine/core";
import axios from "axios";
import { statuses, rtHeader } from "../util/datalist";
import Link from "next/link";
import Icon from "./Icon";

// interface MentorRequestTableProps {
//   requests: [],
//   isAdmin?: boolean,
//   setRequests?
// }

export const MentorRequestTable = ({
  requests,
  isAdmin,
  setRequests,
  isLoading,
}) => {
  return (
    <Table highlightOnHover striped>
      <thead>
        <tr>
          {rtHeader.map((header, i) => (
            <TableHeader
              header={header}
              requests={requests}
              setRequests={setRequests}
              key={`tableHeader${i}`}
            />
          ))}
        </tr>
      </thead>
      {isLoading ? (
        <Text> loading requests </Text>
      ) : (
        <tbody>
          {requests.map((row, i) => (
            <RequestRow
              row={row}
              key={`TableRow${row._id}${i}`}
              isAdmin={isAdmin}
            />
          ))}
        </tbody>
      )}
    </Table>
  );
};

export const RequestRow = ({ row, isAdmin }) => {
  const [rowOpen, setRowOpen] = useState(false);

  return (
    <>
      <tr>
        <td onClick={() => setRowOpen((o) => !o)}>
          <StyledClickableContainer>
            <Icon type={rowOpen ? "chevron-up" : "chevron-down"} width={16} />
          </StyledClickableContainer>
        </td>
        <td>
          <Text
            color={
              row.accepted &&
              row.status != "Completed" &&
              row.status != "Problem" &&
              dayjs(row.accepted).add(2, "months").isBefore(dayjs()) &&
              "red"
            }
          >
            {dayjs(row.createdAt).format("DD/MMM/YYYY")}
          </Text>
        </td>
        <td>
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
      </tr >
      {rowOpen && (
        <tr>
          <td colSpan={12}>
            <Box p="xs">
              <Details item={row} isAdmin={isAdmin} />
            </Box>
          </td>
        </tr>
      )
      }
    </>
  );
};

const Details = ({ item, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { _id } = item;

  const handleIsEditing = () => {
    setIsEditing(!isEditing);
  };

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
      {item.accepted && (
        <>
          <Text>
            <StyledLabel>Mentor:</StyledLabel> {item.mentor?.discordName} -{" "}
            <ClickToCopy>{item.mentor?.discordId}</ClickToCopy>
          </Text>
          <Text>
            <StyledLabel>Accepted:</StyledLabel>{" "}
            {dayjs(item.accepted).format("DD / MMM / YYYY")}
          </Text>
        </>
      )}
      {item.completed && (
        <Text>
          <StyledLabel>Completed:</StyledLabel>{" "}
          {dayjs(item.completed).format("DD / MMM / YYYY")}
        </Text>
      )}
      <StyledLabel>Discord ID:</StyledLabel>{" "}
      <ClickToCopy>{item.discordId}</ClickToCopy>
      <Space h="sm" />
      <Text>
        <StyledLabel>Student notes:</StyledLabel>
        <SimpleGrid cols={2}>{item.info || "N/A"}</SimpleGrid>
      </Text>
      <Space h="sm" />
      <Text>
        <StyledLabel>Mentor comments:</StyledLabel>
        <SimpleGrid cols={2}>{item.comments?.map((comment, i) => {
          <Text key={`Comment${i}`}>
            <Text fs="italic" span>{comment.commenter.discordName}</Text>: {comment.content}
          </Text>
        }) || "N/A"}
        </SimpleGrid>
      </Text>
      <Remarks
        item={item}
        isEditing={isEditing}
        handleIsEditing={handleIsEditing}
      />
      <Space h="lg" />
      {!isEditing ? (
        <>
          <Text>
            <StyledLabel>Other Actions:</StyledLabel>
          </Text>
          <Space h="xs" />
          <Button size='xs' variant="outline" onClick={handleArchive}>
            Archive Request
          </Button>
          {isAdmin && (
            <>
              <Button
                size='xs'
                ml='xs'
                variant="outline"
                color="red"
                onClick={handleDelete}
              >
                Delete Request
              </Button>{" "}
              <Link href={`/admin/student/${item.discordId}`}>
                <Button size='xs' ml='xs' variant="outline" color="teal">
                  All requests by this student
                </Button>
              </Link>
            </>
          )}
        </>
      ) : null}
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

const TableHeader = ({ header, setRequests, requests }) => {
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
      <StyledClickableContainer
        onClick={() => handleClick()}
        disabled={!setRequests}
      >
        <span>{header.title}</span>
        <Icon type="selector" width={12} />
      </StyledClickableContainer>
    </th>
  );
};

const Remarks = ({ item, isEditing, handleIsEditing }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    await axios
      .put(`/api/request/${item._id}`, {
        content,
        type: "remarks",
      })
      .then(() => setIsEditing(false))
      .catch((err) => {
        setError("An error occurred")
      });
  };

  return isEditing ? (
    <>
      <SimpleGrid cols={2}>
        <Textarea
          autosize
          minRows={3}
          error={error}
          onChange={(e) => setContent(e.currentTarget.value)}
          mb="0.5rem"
        />
      </SimpleGrid>
      <Button variant="outline" size='xs' onClick={handleSubmit}>
        Submit
      </Button>
      <Button
        variant="outline"
        size='xs'
        color="gray"
        ml="0.3rem"
        onClick={handleIsEditing}
      >
        Cancel
      </Button>
    </>
  ) : (
    <>
      <Button
        variant="outline"
        size='xs'
        color="gray"
        mt="1rem"
        onClick={handleIsEditing}
      >
        Edit Comments
      </Button>
    </>
  );
};

const sortRequests = ({ requests, reverse, sorter }) => {
  if (!sorter) return;
  return [...requests.sort((a, b) => sorter(reverse ? b : a, reverse ? a : b))];
};

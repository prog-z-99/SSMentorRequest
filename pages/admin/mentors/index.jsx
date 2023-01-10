import { useState, useEffect, forwardRef } from "react";
import { useSession } from "next-auth/react";
import Layout from "../../../components/layout";
import dayjs from "dayjs";
import {
  Select,
  Table,
  Button,
  Text,
  Container,
  Group,
  Mark,
} from "@mantine/core";
import {
  ranks,
  rtFields,
  rtHeader,
  rtTitles,
  statuses,
} from "../../../util/datalist";
import {
  getStatusColor,
  Remarks,
  getStatusIcon,
  ClickToCopy,
} from "../../../components/Styles";
import axios from "axios";
import {
  checkAdmin,
  copyClip,
  getAllChampions,
  isMentor,
} from "../../../util/helper";
import { useRouter } from "next/router";

export default function Mentors({}) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [requests, setRequests] = useState();
  const router = useRouter();
  const [query, setQuery] = useState();
  const [user, setUser] = useState({});

  useEffect(async () => {
    if (loading) return;
    if (!session) {
      router.push("/api/auth/signin");
    } else {
      axios.get("/api/request").then(({ data }) => setRequests(data));
      await axios.post("/api/user", session).then(({ data }) => {
        if (isMentor(data)) {
          setUser(data);
        } else router.push("/");
      });
    }
  }, [loading]);

  useEffect(() => {
    if (query) {
      const { type, sorter, reverse } = query;
      if (type === "sort") {
        setRequests([
          ...requests.sort((a, b) => sorter(reverse ? b : a, reverse ? a : b)),
        ]);
      }
    }
  }, [query]);

  if (!session)
    return (
      <Text>
        Loading mentor details...
        <br />
        If this persists, notify Z on discord
      </Text>
    );

  if (!requests) return <Text>Loading requests, wait a min</Text>;

  const TableHeader = ({ header }) => {
    if (!header.sorter) {
      return <th>{header.title}</th>;
    }

    const handleHeaderClick = (header) => {
      if (header.sorter) {
        setQuery({
          type: "sort",
          sorter: header.sorter,
          reverse: query?.sorter == header.sorter && !query.reverse,
        });
      }
    };
    return (
      <th>
        <Button onClick={() => handleHeaderClick(header)}>
          {header.title}
        </Button>
      </th>
    );
  };

  return (
    <Layout>
      <div>
        <Table highlightOnHover striped>
          <thead>
            <tr>
              {rtHeader.map((header, i) => (
                <TableHeader header={header} key={`tableHeader${i}`} />
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((row, i) => (
              <RequestRow
                row={row}
                key={`TableRow${i}`}
                isAdmin={checkAdmin(user)}
                session={session}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
}

const RequestRow = ({ row, isAdmin, session }) => {
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
          >
            {row.summonerName}
          </a>
        </td>
        <td>{row.rank}</td>
        <td>{row.region}</td>
        <td>{row.role}</td>
        <td>{row.champions}</td>
        <td>{row.timezone}</td>
        <td>
          <TableSelect request={row} session={session} />
        </td>
      </tr>
      {rowOpen && (
        <tr>
          <td colSpan={12}>
            <Details item={row} isAdmin={isAdmin} session={session} />
          </td>
        </tr>
      )}
    </>
  );
};

const Details = ({ item, isAdmin, session }) => {
  const handleArchive = (id) => {
    if (confirm("Are you sure you want to archive this request?")) {
      axios.put("/api/request/change", { id, type: "archive", session });
    } else console.log("not");
  };
  const handleDelete = async (id) => {
    if (confirm("Are you ABSOLUTELY sure you want to delete this request?")) {
      try {
        await axios.put("/api/request/change", { id, type: "delete", session });
        alert("Request deleted");
      } catch {
        alert("Something didn't work. Notify Z if the request is not deleted");
      }
    } else console.log("not");
  };
  return (
    <Container fluid>
      <Text>Notes: {item.info} </Text>
      <Text>
        Accepted At: {item.accepted ? dayjs(item.accepted).format("l") : ""}
      </Text>
      <Text>Accepted Mentor: {item.mentor}</Text>
      <Text>
        Completed At: {item.completed ? dayjs(item.completed).format("l") : ""}
      </Text>
      <ClickToCopy>Discord ID: {item.discordId}</ClickToCopy>
      <Remarks id={item.id} content={item.remarks} session={session} />
      {isAdmin && (
        <>
          <Button onClick={() => handleArchive(item.id)}>
            ARCHIVE THIS REQUEST
          </Button>
          <Button onClick={() => handleDelete(item.id)}>
            DELETE THIS REQUEST
          </Button>
        </>
      )}
    </Container>
  );
};

const TableSelect = ({ request, session }) => {
  const handleStatusChange = async (value, id) => {
    await axios
      .put("/api/request/change", { id, value, type: "status", session })
      .then(() => {
        alert("successfully changed");
      })
      .catch(() => {
        alert("error, some shit gone wrong. nag Z about this");
      });
  };
  return (
    <Select
      data={statuses}
      icon={getStatusIcon(request.status)}
      value={request.status}
      onChange={(e) => handleStatusChange(e, request.id)}
    />
  );
};

// export async function getServerSideProps({ req, res }) {
//   // const requests = await getAllRequests();
//   res.setHeader(
//     "Cache-Control",
//     "public, s-maxage=10, stale-while-revalidate=59"
//   );

//   const championList = await getAllChampions();

//   return {
//     props: {
//       // requests,
//       championList,
//     },
//   };
// }

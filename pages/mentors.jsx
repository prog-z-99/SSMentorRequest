import { useState } from "react";
import { connectToDatabase } from "../util/mongodb";
import User from "../models/userModel";
import Request from "../models/requestModel";
import { getSession } from "next-auth/client";
import Layout from "../components/layout";
import { Table } from "antd";
import "antd/lib/table/style/index.css";
import moment from "moment";

import { ranks, statuses } from "../util/datalist";
// import Select from "react-select";
import {
  formatterColored,
  TableSelect,
  getStatusColor,
  Expanded,
} from "../components/Styles";
import axios from "axios";

export default function Mentors({ session, requests }) {
  const [query, setQuery] = useState({});
  const columns = [
    {
      dataIndex: "createdAt",
      title: "Created",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      dataIndex: "discordName",
      title: "Discord Username",
      sorter: (a, b) => `${a.discordName}`.localeCompare(b.discordName),
    },
    {
      dataIndex: "rank",
      title: "Rank",
      sorter: (a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank),
    },
    {
      dataIndex: "region",
      title: "Region",
      sorter: (a, b) => a.region.localeCompare(b.region),
    },
    { dataIndex: "opgg", title: "OP.GG" },
    {
      dataIndex: "role",
      title: "Role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    { dataIndex: "champions", title: "Champions" },
    { dataIndex: "timezone", title: "Time Zone" },
    // { dataIndex: "info", title: "Additional Information", ellipsis: true },
    {
      dataIndex: "status",
      title: "Status",
      render: (text, record, index) => (
        <TableSelect
          className={text}
          options={formatterColored(statuses)}
          defaultValue={{
            label: text,
            value: text,
            color: getStatusColor(text),
          }}
          styles={colourStyles}
          onChange={(e) => handleStatusChange(e, record.id)}
        />
      ),
      width: 200,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    // {
    //   dataIndex: "accepted",
    //   title: "Accepted Date",
    //   sorter: (a, b) =>
    //     a.accepted && b.accepted
    //       ? new Date(a.accepted) - new Date(b.accepted)
    //       : 0,
    // },
    // {
    //   dataIndex: "completed",
    //   title: "Completed Date",
    //   sorter: (a, b) => new Date(a.completed) - new Date(b.completed),
    // },
    // { dataIndex: "mentor", title: "Accepted Mentor" },
  ];
  const dot = (color = "#ccc") => ({
    alignItems: "center",
    display: "flex",
    backgroundColor: color,

    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: "8px",
      height: 10,
      width: 10,
    },
  });

  const handleStatusChange = async ({ value }, id) => {
    await axios
      .put("/api/request/change", { id, value })
      .then(() => {
        alert("successfully changed");
      })
      .catch(() => {
        alert("error, some shit gone wrong. nag Z about this");
      });
  };

  const colourStyles = {
    placeholder: (styles) => ({ ...styles, ...dot() }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };
  const rows = requests.map((item) => {
    return {
      ...item,
      key: item.id,
      createdAt: moment(item.createdAt).format("l"),
      completed: item.completed ? moment(item.completed).format("l") : "",
      accepted: item.accepted ? moment(item.accepted).format("l") : "",
    };
  });

  return (
    <Layout>
      <div>
        <Table
          dataSource={rows}
          columns={columns}
          density="compact"
          autoHeight
          pagination={false}
          expandable={{
            expandedRowRender: (item) => (
              <Expanded>
                <p> Notes: {item.info} </p>
                <p>Accepted At: {item.accepted}</p>
                <p>Accepted Mentor: {item.mentor}</p>
                <p>Completed At: {item.completed}</p>
                <p>Discord ID: {item.discordId}</p>
              </Expanded>
            ),
          }}
        />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
    };
  }
  await connectToDatabase();

  const user = await User.findOne({ discordId: session.user.id });

  if (!user || user.userType == "user") {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const requests = await Request.find({})
    .select(" -updatedAt -__v")
    .populate("mentor")
    .then((items) => {
      return items.map((item) => {
        return {
          id: item._id.toString(),
          status: item.status,
          rank: item.rank,
          region: item.region,
          opgg: item.opgg,
          role: item.role,
          champions: item.champions,
          timezone: item.timezone,
          info: item.info,
          createdAt: item.createdAt.toString(),
          discordName: item.discordName,
          discordId: item.discordId,
          accepted: item.accepted?.toString() || null,
          completed: item.completed?.toString() || null,
          mentor: item.mentor?.discordName || null,
        };
      });
    });

  return {
    props: {
      session,
      requests,
    },
  };
}

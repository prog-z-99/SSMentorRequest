import { connectToDatabase } from "../util/mongodb";
import User from "../models/userModel";
import Request from "../models/requestModel";
import { getSession } from "next-auth/client";
import Layout from "../components/layout";
import { Table } from "antd";
import "antd/lib/table/style/index.css";
import "antd/lib/pagination/style/index.css";
import moment from "moment";

import { ranks, statuses } from "../util/datalist";
// import Select from "react-select";
import { formatter, TableSelect } from "../components/Styles";

export default function Mentors({ session, requests }) {
  const columns = [
    {
      dataIndex: "createdAt",
      title: "Created",
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      dataIndex: "discordName",
      title: "Discord Username",
      sorter: (a, b) => {},
    },
    {
      dataIndex: "rank",
      title: "Rank",
      sorter: (a, b) => {
        ranks.indexOf(a.rank) - ranks.indexOf(b.rank);
      },
    },
    { dataIndex: "region", title: "Region" },
    { dataIndex: "opgg", title: "OP.GG" },
    { dataIndex: "role", title: "Role" },
    { dataIndex: "champions", title: "Champions" },
    { dataIndex: "timezone", title: "Time Zone" },
    { dataIndex: "info", title: "Additional Information", ellipsis: true },
    {
      dataIndex: "status",
      title: "Status",
    },
  ];
  const dot = (color = "#ccc") => ({
    alignItems: "center",
    display: "flex",

    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  const styles = {
    input: (styles) => ({ ...styles, ...dot() }),
  };
  const rows = requests.map((item) => {
    return {
      ...item,
      key: item.id,
      createdAt: moment(item.createdAt).format("l"),
      status: (
        <TableSelect
          className={item.status}
          options={formatter(statuses)}
          defaultValue={{ label: item.status, value: item.status }}
          styles={styles}
        />
      ),
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
          scroll={{ x: 1300 }}
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

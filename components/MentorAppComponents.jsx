import React, { useEffect } from "react";
import { useMemo, useState } from "react";
import {
  Button,
  Container,
  Grid,
  Group,
  Chip,
  Table,
  Text,
  Title,
  Tabs,
} from "@mantine/core";
import axios from "axios";
import { ClickToCopy } from "./Styles";
import dayjs from "dayjs";

export const AppList = ({ reviewerId }) => {
  const [applications, setApplications] = useState([]);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    axios
      .get("/api/admin/apps")
      .then(({ data }) => {
        setApplications(filterApps(data, false));
        setApps(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const onTabChange = (value) => {
    const checker = value == "processed";
    setApplications(filterApps(apps, checker));
  };

  return (
    <div>
      <Title>Mentor Applications</Title>
      <Tabs onTabChange={onTabChange} defaultValue={"pending"}>
        <Tabs.List>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="processed">Processed</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Table striped>
        <thead>
          <tr>
            <th>Discord name</th>
          </tr>
        </thead>
        <tbody>
          {applications?.map((app, i) => (
            <AppRow
              app={app}
              key={`TableRow${i * 2}`}
              reviewerId={reviewerId}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const filterApps = (apps, processed) => {
  return apps.filter((app) => app.processed == processed);
};

const AppRow = ({ app, reviewerId }) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <tr onClick={() => setOpen(!open)}>
        <td>
          <Text td={app.processed && "line-through"}>{app.discordName}</Text>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={6}>
            <AppDetails item={app} reviewerId={reviewerId} />
          </td>
        </tr>
      )}
    </>
  );
};

const AppDetails = ({ item, reviewerId }) => {
  const { yay, nay, meh, discordId, discordName, region, processed } = item;
  const value = useMemo(() => {
    if (yay.includes(reviewerId)) return "yay";
    if (nay.includes(reviewerId)) return "nay";
    if (meh.includes(reviewerId)) return "meh";
  }, [yay, nay, meh, reviewerId]);
  const [vote, setVote] = useState(value);
  const [voteLoading, setVoteLoading] = useState(false);
  const handleVote = (e) => {
    setVoteLoading(true);
    axios
      .put("/api/user/application", { id: item.discordId, vote: e })
      .then(() => {
        setVote(e);
        setVoteLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("An error has occurred, please notify Z");
        setVoteLoading(false);
      });
  };
  const handleAccept = () => {
    axios
      .post("/api/user/mentor", {
        user: { discordId, discordName, mentorRegion: region },
        command: "ACCEPT",
      })
      .then(({ data }) => alert(data))
      .catch((error) => console.log(error));
  };
  const handleDeny = () => {
    axios.post("/api/user/mentor", { user: { discordId }, command: "DENY" });
  };

  return (
    <Container fluid>
      <Grid>
        <Grid.Col span={6}>
          <Text>
            Summoner:{" "}
            <a
              href={`https://${item.region}.op.gg/summoner/userName=${item.summonerName}`}
              rel={"noreferrer"}
              target={"_blank"}
            >
              {item.summonerName}
            </a>
          </Text>
          <Text>Rank: {item.rank}</Text>
          <Text>
            Discord ID: <ClickToCopy>{item.discordId}</ClickToCopy>
          </Text>
          <Text>Applied at: {dayjs(item.createdAt).format("DD/MMM/YYYY")}</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Chip.Group label={"Vote"} value={vote} onChange={handleVote}>
            <Group>
              <Chip value={"yay"} label={"Yay"} disabled={voteLoading}>
                Yay: {item.yay.length - (value == "yay") + (vote == "yay")}
              </Chip>
              <Chip value={"nay"} label={"Nay"} disabled={voteLoading}>
                Nay : {item.nay.length - (value == "nay") + (vote == "nay")}
              </Chip>
              <Chip value={"meh"} label={"Meh"} disabled={voteLoading}>
                Meh: {item.meh.length - (value == "meh") + (vote == "meh")}
              </Chip>
            </Group>
          </Chip.Group>
        </Grid.Col>
        <Grid.Col span={3}>
          <Button onClick={handleAccept} disabled={processed}>
            Add mentor
          </Button>
          <Button onClick={handleDeny} disabled={processed}>
            Deny
          </Button>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text>Reason for applying: {item.appReason}</Text>
        </Grid.Col>
        <Grid.Col>
          <Text>Experience: {item.experience}</Text>
        </Grid.Col>
        <Grid.Col span={12}>Champ win con: {item.winConEx}</Grid.Col>
        <Grid.Col span={12}>Losing matchup: {item.loseMatchupEx}</Grid.Col>
        <Grid.Col span={12}>Bad take in chat: {item.rebuttalEx}</Grid.Col>
        <Grid.Col>{item.comments}</Grid.Col>
      </Grid>
    </Container>
  );
};

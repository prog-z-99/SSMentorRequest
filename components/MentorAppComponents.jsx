import {
  Button,
  Container,
  Grid,
  Group,
  Radio,
  Table,
  Text,
} from "@mantine/core";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { ClickToCopy, MentorsWrapper } from "./Styles";

export const AppList = ({ apps, reviewerId }) => {
  return (
    <MentorsWrapper>
      Mentor Applications
      <Table striped>
        <thead>
          <tr>
            <th>Discord name</th>
            <th>Discord ID</th>
            <th>Rank</th>
            <th>Yay</th>
            <th>Nay</th>
            <th>Meh</th>
          </tr>
        </thead>
        <tbody>
          {apps?.map((app, i) => (
            <AppRow
              app={app}
              key={`TableRow${i * 2}`}
              reviewerId={reviewerId}
            />
          ))}
        </tbody>
      </Table>
    </MentorsWrapper>
  );
};

const AppRow = ({ app, reviewerId }) => {
  const [open, setOpen] = useState(!app.processed);
  return (
    <>
      <tr onClick={() => setOpen(!open)}>
        <td>
          <Text td={app.processed && "line-through"}>{app.discordName}</Text>
        </td>
        <td>
          <ClickToCopy>{app.discordId}</ClickToCopy>
        </td>
        <td>{app.rank}</td>
        <td>{app.yay?.length}</td>
        <td>{app.nay?.length}</td>
        <td>{app.meh?.length}</td>
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
  const handleVote = (e) => {
    axios
      .put("/api/user/application", { id: item.discordId, vote: e })
      .then(() => {
        setVote(e);
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
    axios.post("api/user/mentor", { user: { discordId }, command: "DENY" });
  };

  return (
    <Container fluid>
      <Grid>
        <Grid.Col span={6}>Reason for applying: {item.appReason}</Grid.Col>
        <Grid.Col span={6}>Champ win con: {item.winConEx}</Grid.Col>
        <Grid.Col span={6}>Losing matchup: {item.loseMatchupEx}</Grid.Col>
        <Grid.Col span={6}>Bad take in chat: {item.rebuttalEx}</Grid.Col>

        <Grid.Col span={3}>Experience: {item.experience}</Grid.Col>
        <Grid.Col span={3}>
          Summoner:{" "}
          <a
            href={`https://${item.region}.op.gg/summoner/userName=${item.summonerName}`}
            rel={"noreferrer"}
            target={"_blank"}
          >
            {item.summonerName}
          </a>
        </Grid.Col>
        <Grid.Col span={3}>
          <Radio.Group
            label={"Vote"}
            withAsterisk
            value={vote}
            onChange={handleVote}
          >
            <Group>
              <Radio value={"yay"} label={"Yay"} />
              <Radio value={"nay"} label={"Nay"} />
              <Radio value={"meh"} label={"Meh"} />
            </Group>
          </Radio.Group>
        </Grid.Col>
        <Grid.Col span={3}>
          <Button onClick={handleAccept} disabled={processed}>
            Add mentor
          </Button>
          <Button onClick={handleDeny} disabled={processed}>
            Deny
          </Button>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

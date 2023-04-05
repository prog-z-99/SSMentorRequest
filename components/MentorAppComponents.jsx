import React from "react";
import { useMemo, useState } from "react";
import {
  Button,
  Container,
  Grid,
  Group,
  Chip,
  Table,
  Text,
} from "@mantine/core";
import axios from "axios";
import { ClickToCopy } from "./Styles";

export const AppList = ({ apps, reviewerId }) => {
  return (
    <div>
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
    </div>
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
          <Text>Reason for applying: {item.appReason}</Text>
          <Text>Experience: {item.experience}</Text>
        </Grid.Col>
        <Grid.Col span={6}>Champ win con: {item.winConEx}</Grid.Col>
        <Grid.Col span={6}>Losing matchup: {item.loseMatchupEx}</Grid.Col>
        <Grid.Col span={6}>Bad take in chat: {item.rebuttalEx}</Grid.Col>

        <Grid.Col span={3}></Grid.Col>
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
          <Chip.Group label={"Vote"} value={vote} onChange={handleVote}>
            <Group>
              <Chip value={"yay"} label={"Yay"} disabled={voteLoading}>
                Yay
              </Chip>
              <Chip value={"nay"} label={"Nay"} disabled={voteLoading}>
                Nay
              </Chip>
              <Chip value={"meh"} label={"Meh"} disabled={voteLoading}>
                Meh
              </Chip>
            </Group>
          </Chip.Group>
        </Grid.Col>
        <Grid.Col span={3}>
          <Button
            onClick={handleAccept}
            //disabled={processed}
          >
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

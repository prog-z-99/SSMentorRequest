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
  Title,
  Tabs,
  Modal,
  Textarea,
} from "@mantine/core";
import axios from "axios";
import { ClickToCopy, StyledClickableContainer } from "./Styles";
import dayjs from "dayjs";
import Icon from "./Icon";
import Link from "next/link";

export const AppList = ({ allApps, reviewerId }) => {
  const [applications, setApplications] = useState(
    filterApps(allApps, "pending")
  );
  const onTabChange = (value) => {
    setApplications(filterApps(allApps, value));
  };

  return (
    <div>
      <Title>Mentor Applications</Title>
      <Tabs onTabChange={onTabChange} defaultValue={"pending"}>
        <Tabs.List>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="trial">Trials</Tabs.Tab>
          <Tabs.Tab value="processed">Processed</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Table striped>
        <thead>
          <tr>
            <th />
            <th>Discord name</th>
          </tr>
        </thead>
        <tbody>
          {applications?.length == 0 && <>All apps processed!</>}
          {applications?.map((app, i) => (
            <AppRow
              app={app}
              key={`TableRow${i * 2}${app.discordId}`}
              reviewerId={reviewerId}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const filterApps = (apps, type) => {
  return apps.filter((app) => app.appStatus == type);
};

const AppRow = ({ app, reviewerId }) => {
  // @fish use this for the open/closing
  const [open, setOpen] = useState(
    app.appStatus == "processed" ? false : !hasVoted(app, reviewerId)
  );

  return (
    <>
      <tr>
        <td onClick={() => setOpen((o) => !o)}>
          <StyledClickableContainer>
            <Icon type={open ? "chevron-up" : "chevron-down"} width={16} />
          </StyledClickableContainer>
        </td>
        <td>
          <Text td={app.appStatus == "processed" && "line-through"}>
            {app.discordName}
          </Text>
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

const hasVoted = (app, reviewerId) => {
  return (
    app.yay.includes(reviewerId) ||
    app.nay.includes(reviewerId) ||
    app.meh.includes(reviewerId)
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
      .put("/api/admin/application", { id: item.discordId, vote: e })
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
          {item.appStatus == "trial" && (
            <Link href={`/admin/mentors/${discordId}`}>
              <Text>Request count: {item.requestCount}</Text>
            </Link>
          )}
        </Grid.Col>
        <Grid.Col span={3}>
          <Chip.Group label={"Vote"} value={vote} onChange={handleVote}>
            <Group>
              <Chip value={"yay"} label={"Yay"} disabled={voteLoading}>
                Yay: {yay.length - (value == "yay") + (vote == "yay")}
              </Chip>
              <Chip value={"nay"} label={"Nay"} disabled={voteLoading}>
                Nay : {nay.length - (value == "nay") + (vote == "nay")}
              </Chip>
              <Chip value={"meh"} label={"Meh"} disabled={voteLoading}>
                Meh: {meh.length - (value == "meh") + (vote == "meh")}
              </Chip>
            </Group>
          </Chip.Group>
        </Grid.Col>
        <Grid.Col span={3}>
          <Button
            onClick={handleAccept}
            // disabled={item.appStatus == "processed"}
          >
            {item.appStatus == "trial" ? "Finish Trial" : "Start Trial"}
          </Button>
          <Button onClick={handleDeny} disabled={processed}>
            Deny
          </Button>
          <CommentModal item={item} />
          <VotedModal item={item} />
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
        <Grid.Col span={12}>
          <Text>
            Comments:
            <ul>
              {item.comments?.map((comment, i) => (
                <li key={`Comment${i}`}>
                  {comment.commenter.discordName} : {comment.content}
                </li>
              ))}
            </ul>
          </Text>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

const CommentModal = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const addComment = () => {
    axios
      .patch("/api/admin/application", { user: item.discordId, content })
      .then(() => setOpen(false))
      .catch(() => setError("Error occurred"));
  };
  return (
    <>
      <Modal
        centered
        title={`Comment for ${item.discordName}`}
        opened={open}
        onClose={() => setOpen(false)}
      >
        <Textarea
          onChange={(e) => setContent(e.currentTarget.value)}
          error={error}
        />
        <Button onClick={() => addComment()}>Submit</Button>
      </Modal>
      <Button onClick={() => setOpen(true)}>Add Comment</Button>
    </>
  );
};

const VotedModal = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Modal
        opened={open}
        centered
        title="All voted mentors"
        onClose={() => setOpen(false)}
      >
        <ul>
          {item.voted.map((reviewer, i) => (
            <li key={`AppVotedCount${i}`}>{reviewer.discordName}</li>
          ))}
        </ul>
      </Modal>
      <Button onClick={() => setOpen(true)}>Voted mentors</Button>
    </>
  );
};

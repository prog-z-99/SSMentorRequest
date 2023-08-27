import {
  Button,
  Container,
  MultiSelect,
  Select,
  Table,
  Title,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { regions, roles, userSelectCommand } from "../util/datalist";
import { getAllMentorChampions } from "../util/helper";

export const MentorList = ({ mentors }) => {
  return (
    <>
      <Title align="center" order={3}>
        Summoner School Mentor List
      </Title>
      <Table striped>
        <thead>
          <tr>
            <th>Mentor name</th>
            <th>Preferred roles</th>
            <th>Additionally experienced in:</th>
            <th>Peak Rank</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {mentors?.map((mentor, i) => (
            <tr key={`TableRow${i}`}>
              <td>{mentor.discordName}</td>
              <td>{mentor.preferredRoles?.join(", ")}</td>
              <td>{mentor.bestChampions?.join(", ")}</td>
              <td>{mentor.peakRank}</td>
              <td>{mentor.mentorRegion}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export const MentorProfileComponent = ({
  mentor: { discordName, bestChampions, preferredRoles, mentorRegion, _id },
}) => {
  const [champions, setChampions] = useState([]);
  const [selectedChampions, setSelectedChampions] = useState(bestChampions);
  const [selectedRoles, setSelectedRoles] = useState(preferredRoles);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getChampions = async () => {
      setChampions(await getAllMentorChampions());
    };
    getChampions();
  }, []);

  const handleSelect = (value, field) => {
    setLoading(true);
    axios
      .put("/api/user/mentor", {
        userId: _id,
        command: userSelectCommand(field),
        value,
      })
      .then(({ data }) => {
        //TODO change this to popup
        alert(data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container>
      {discordName}
      <MultiSelect
        label="Main champions"
        data={champions}
        value={selectedChampions}
        onChange={setSelectedChampions}
        searchable
        disabled={champions.length == 0}
      />
      <Button
        onClick={() => handleSelect(selectedChampions, "champions")}
        disabled={loading}
      >
        Save
      </Button>

      <MultiSelect
        label="Preferred roles"
        value={selectedRoles}
        data={roles}
        onChange={setSelectedRoles}
      />
      <Button
        onClick={() => handleSelect(selectedRoles, "roles")}
        disabled={loading}
      >
        Save
      </Button>
      <Select
        label="Region"
        defaultValue={mentorRegion}
        data={regions}
        onChange={(e) => handleSelect(e, "region")}
      />
    </Container>
  );
};

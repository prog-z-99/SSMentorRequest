import { MultiSelect, Select, Table } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { regions, roles, userSelectCommand } from "../util/datalist";
import { getAllChampions } from "../util/helper";
import { MentorsWrapper } from "./Styles";

export const MentorList = ({ mentors }) => {
  return (
    <MentorsWrapper>
      Summoner School Mentor List
      <Table striped>
        <thead>
          <tr>
            <th>Mentor name</th>
            <th>Preferred roles</th>
            <th>Main champions</th>
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
    </MentorsWrapper>
  );
};

export const MentorProfileComponent = ({
  mentor: { discordName, bestChampions, preferredRoles, mentorRegion, _id },
}) => {
  const [champions, setChampions] = useState([]);
  const [selectedChampions, setSelectedChampions] = useState(bestChampions);
  const [selectedRoles, setSelectedRoles] = useState(preferredRoles);
  useEffect(() => {
    const getChampions = async () => {
      setChampions(await getAllChampions());
    };
    getChampions();
  }, []);

  const handleSelect = (value, field) => {
    axios
      .put("/api/user/mentor", {
        userId: _id,
        command: userSelectCommand(field),
        value,
      })
      .then(({ data }) => alert(data))
      .catch((error) => console.log(error));
  };

  return (
    <MentorsWrapper>
      {discordName}
      <MultiSelect
        label="Main champions"
        data={champions}
        value={selectedChampions}
        onChange={setSelectedChampions}
        searchable
        onDropdownClose={() => handleSelect(selectedChampions, "champions")}
      />
      <MultiSelect
        label="Preferred roles"
        value={selectedRoles}
        data={roles}
        onChange={setSelectedRoles}
        onDropdownClose={() => handleSelect(selectedRoles, "roles")}
      />
      <Select
        label="Region"
        defaultValue={mentorRegion}
        data={regions}
        onChange={(e) => handleSelect(e, "region")}
      />
    </MentorsWrapper>
  );
};

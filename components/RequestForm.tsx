import React, { useState } from "react";
import { ranks, regions, roles } from "../util/datalist";
import { ChampionSelect } from "./Styles";
import axios from "axios";
import { Button, Container, Select, Stack, TextInput } from "@mantine/core";
import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import { timeZones } from "../util/helper";

const RequestForm = ({ setSent }) => {
  const { isValid, values, getInputProps } = useForm({
    initialValues: {
      rank: "",
      summonerName: "",
      role: "",
      region: "",
      timezone: "",
      info: "",
      champions: [],
    },
    validate: {
      rank: isNotEmpty("Please select your Rank "),
      summonerName: isNotEmpty("Please enter your Summoner Name"),
      role: isNotEmpty("Please select your role"),
      region: isNotEmpty("Please select your region"),
      timezone: isNotEmpty("Please select your timezone"),
      champions: hasLength({ min: 1 }, "Please select at least one champion"),
    },
    validateInputOnBlur: true,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (isValid()) {
      await axios
        .post("/api/request", values)
        .then(() => {
          setSent(true);
        })
        .catch(() => {
          alert(
            "Error. Please check your form. If this issue persists, please contact the Mod team"
          );
        });
    }
    setLoading(false);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Summoner name"
            placeholder="Only put in your main account"
            {...getInputProps("summonerName")}
          />
          <Select label="Rank" data={ranks} {...getInputProps("rank")} />
          <Select label="Region" data={regions} {...getInputProps("region")} />
          <Select label="Role" data={roles} {...getInputProps("role")} />
          <ChampionSelect {...getInputProps("champions")} />
          <Select
            label="Timezone"
            data={timeZones()}
            {...getInputProps("timezone")}
          />
          <TextInput
            label="Any additional information you would like the mentors to know (if nothing, leave blank)"
            {...getInputProps("info")}
          />

          <Button type="submit" disabled={loading || !isValid()}>
            Send Request
          </Button>
        </Stack>
      </form>
    </Container>
  );
};
export default RequestForm;

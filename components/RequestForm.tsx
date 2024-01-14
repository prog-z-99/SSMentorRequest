import React, { useState } from "react";
import { regions, roles } from "../util/datalist";
import { ChampionSelect } from "./Styles";
import axios from "axios";
import {
  ActionIcon,
  Button,
  Container,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import { timeZones } from "../util/helper";

const RequestForm = ({ setSent }) => {
  const { isValid, values, getInputProps, setValues, setErrors, errors } =
    useForm({
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
          <Select label="Region" data={regions} {...getInputProps("region")} />

          <TextInput
            label="Riot ID"
            placeholder={
              values.region
                ? "Your full Riot ID with the # code"
                : "Enter your region first"
            }
            description={
              values.summonerName &&
              !values.rank &&
              "Check if your account is valid with button on the right"
            }
            rightSection={
              <RiotIdChecker
                values={values}
                error={errors.summonerName}
                setValues={setValues}
                setErrors={setErrors}
                isApply={false}
              />
            }
            disabled={!values.region}
            {...getInputProps("summonerName")}
          />

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

export const RiotIdChecker = ({
  values: { summonerName, region, rank },
  setValues,
  setErrors,
  error,
  isApply,
}) => {
  const [loading, setLoading] = useState(false);

  const checkAccount = () => {
    setLoading(true);
    setErrors({ summonerName: false });
    axios
      .put("/api/request", { riotId: summonerName, region })
      .then(({ data }) => {
        const rank = data.tier;
        const games = data.wins + data.losses;
        setLoading(false);
        if (isApply || games >= 25) setValues({ rank });
        else {
          setValues({ rank: null });
          setErrors({
            summonerName:
              "You do not meet the required number of games. Please apply after meeting the requirements",
          });
        }
      })
      .catch(() => {
        setValues({ rank: null });
        setErrors({
          summonerName:
            "An error has occurred. Please check if you entered the correct ID",
        });
        setLoading(false);
      });
  };
  return (
    <ActionIcon
      loading={loading}
      onClick={checkAccount}
      variant={"filled"}
      color={rank ? "green" : error ? "red" : "blue"}
    >
      {loading ? null : error ? "!" : "O"}
    </ActionIcon>
  );
};

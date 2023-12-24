import React, { useState } from "react";
import { fullRanks, mentorFormQuestions, regions } from "../util/datalist";
import axios from "axios";
import {
  Button,
  Container,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

const MentorApplicationForm = ({ setSent }) => {
  const { isValid, values, getInputProps } = useForm({
    initialValues: {
      rank: "",
      summonerName: "",
      region: "",
      appReason: "",
    },
    validate: {
      rank: isNotEmpty("Please select your Rank "),
      summonerName: (value) =>
        /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/g.test(
          value
        )
          ? "This is a link"
          : isNotEmpty("Please enter your Summoner Name")(value),
      region: isNotEmpty("Please select your region"),
      appReason: isNotEmpty("*Required"),
      loseMatchupEx: isNotEmpty("*Required"),
      rebuttalEx: isNotEmpty("*Required"),
      winConEx: isNotEmpty("*Required"),
    },
    validateInputOnBlur: true,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isValid()) {
      await axios
        .post("/api/user/application", values)
        .then(() => {
          setSent(true);
        })
        .catch((error) => {
          setSent(true);
          console.log(error);
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
            placeholder="Only put your main account"
            {...getInputProps("summonerName")}
          />
          <Select label="Region" data={regions} {...getInputProps("region")} />
          <Select label="Rank" data={fullRanks()} {...getInputProps("rank")} />
          {mentorFormQuestions.map((question, i) => (
            <Textarea
              key={`MentorFormQuestion${i}`}
              label={question.title}
              {...getInputProps(question.field)}
            />
          ))}

          <Button type="submit" disabled={loading || !isValid()}>
            Send application
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default MentorApplicationForm;

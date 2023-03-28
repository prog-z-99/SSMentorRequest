import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { withFormik } from "formik";
import { ranks, regions, roles } from "../util/datalist";
import { FormSelect } from "./Styles";
import axios from "axios";
import { useRouter } from "next/router";
import { Button, Container, MultiSelect, TextInput } from "@mantine/core";
import { getAllChampions } from "../util/helper";

const FormEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    rank: Yup.string().required("Please select your Rank "),
    summonerName: Yup.string().required("Please enter your Summoner Name"),
    role: Yup.string().required("Please select your role"),
    region: Yup.string().required("Please select your region"),
    timezone: Yup.string().required("Please select your timezone"),
    champions: Yup.array().min(1, "Please select at least one champion"),
  }),
  validateOnMount: true,
});

const timeZone = () => {
  const zones = [];
  for (let i = -11; i <= 12; i++) {
    zones.push(`UTC ${i}`);
  }
  return zones;
};

const MentorRequestForm = (props) => {
  const { isValid, values, errors, handleChange, handleBlur, setFieldValue } =
    props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [champions, setChampions] = useState([]);

  useEffect(() => {
    const getChampions = async () => {
      setChampions(await getAllChampions());
    };
    getChampions();
  }, []);

  async function sendMentorRequest(values) {
    await axios
      .post("/api/request", values)
      .then(() => {
        alert("Request has been sent!");
        router.push("/");
      })
      .catch(() => {
        alert(
          "Error. Please check your form. If this issue persists, please contact the Mod team"
        );
      });
  }
  const handleSubmit = async () => {
    setLoading(true);
    if (isValid) {
      delete values.championList;
      sendMentorRequest(values);
    }
    setLoading(false);
  };

  const onChange = (obj, field) => {
    setFieldValue(field, obj);
  };

  const zones = timeZone();

  return (
    <Container>
      <FormSelect
        title="Rank"
        name="rank"
        options={ranks}
        onChange={onChange}
        error={errors.rank}
        value={values.rank}
      />
      <FormSelect
        title="Region"
        name="region"
        options={regions}
        error={errors.region}
        onChange={onChange}
      />
      <TextInput
        title="Summoner name"
        id="summonerName"
        placeholder="Only put in your main account"
        value={values.summonerName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.summonerName}
      />
      <FormSelect
        title="Role"
        name="role"
        options={roles}
        onChange={onChange}
        error={errors.role}
      />
      <MultiSelect
        label={"Champions"}
        data={champions}
        error={errors.champions}
        searchable
        onChange={(e) => onChange(e, "champions")}
      />
      <FormSelect
        title="Timezone"
        name="timezone"
        options={zones}
        onChange={onChange}
        error={errors.timezone}
      />
      <TextInput
        label="Any additional information you would like the mentors to know (if nothing, leave blank)"
        id="info"
        value={values.info}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Button onClick={handleSubmit} disabled={loading || !isValid}>
        Send Request
      </Button>
    </Container>
  );
};

export default FormEnhancer(MentorRequestForm);

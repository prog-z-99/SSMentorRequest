import React, { useState } from "react";
import * as Yup from "yup";
import { withFormik } from "formik";
import { fullRanks, mentorFormQuestions, regions } from "../util/datalist";
import { FormSelect, FormTextField, StyledForm } from "./Styles";
import axios from "axios";
import { useRouter } from "next/router";
import { Button, Textarea } from "@mantine/core";

const FormEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    rank: Yup.string().required("Please select your Rank "),
    summonerName: Yup.string().required("Please enter your Summoner Name"),
    region: Yup.string().required("Please select your region"),
    appReason: Yup.string().required("*Required"),
    loseMatchupEx: Yup.string().required("*Required"),
    rebuttalEx: Yup.string().required("*Required"),
    winConEx: Yup.string().required("*Required"),
  }),
  validateOnMount: true,
});

const MentorRequestForm = (props) => {
  const { isValid, values, errors, handleChange, handleBlur, setFieldValue } =
    props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    if (isValid) {
      axios
        .post("/api/user/application", values)
        .then(() => {
          alert("Request has been sent! We will reach you back in 1-2 weeks");
          router.push("/");
        })
        .catch((error) => {
          alert(error.response.data.error);
          setLoading(false);
        });
    }
  };

  const onChange = (obj, field) => {
    setFieldValue(field, obj);
  };

  return (
    <StyledForm>
      <FormTextField
        title="Summoner name"
        id="summonerName"
        placeholder="Only put your main account"
        value={values.summonerName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.summonerName}
      />
      <FormSelect
        title="Region"
        name="region"
        options={regions}
        error={errors.region}
        onChange={onChange}
      />
      <FormSelect
        title="Rank"
        name="rank"
        options={fullRanks()}
        onChange={onChange}
        error={errors.rank}
      />
      {mentorFormQuestions.map((question, i) => (
        <Textarea
          key={`MentorFormQuestion${i}`}
          onChange={handleChange}
          label={question.title}
          id={question.field}
          error={errors[question.field]}
        />
      ))}

      <Button onClick={handleSubmit} disabled={loading}>
        Send application
      </Button>
    </StyledForm>
  );
};

export default FormEnhancer(MentorRequestForm);

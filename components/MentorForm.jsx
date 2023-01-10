import React, { useState } from "react";
import * as Yup from "yup";
import { withFormik } from "formik";
import { ranks, regions, roles } from "../util/datalist";
import { FormSelect, FormTextField, StyledForm } from "./Styles";
import axios from "axios";
import { useRouter } from "next/router";
import { Textarea } from "@mantine/core";

const FormEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    rank: Yup.string().required("Please select your Rank "),
    summonerName: Yup.string().required("Please enter your Summoner Name"),
    role: Yup.string().required("Please select your role"),
    region: Yup.string().required("Please select your region"),
    timezone: Yup.string().required("Please select your timezone"),
  }),
  handleSubmit: () => {},
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
  const handleSubmit = async () => {
    setLoading(true);
    if (isValid) {
      await axios
        .post("/api/request/create", values)
        .then(() => {
          alert("Request has been sent!");
          router.push("/");
        })
        .catch((error) => {
          alert(
            "Error. Please check your form. If this issue persists, please contact the Mod team"
          );
        });
    }
    setLoading(false);
  };

  const onChange = (obj, field) => {
    setFieldValue(field, obj.value);
  };

  const zones = timeZone();

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormSelect
        title="Region"
        name="region"
        options={regions}
        error={errors.region}
        onChange={onChange}
      />
      <FormTextField
        title="Summoner name"
        id="summonerName"
        placeholder="Summoner name"
        value={values.summonerName}
        onChange={handleChange}
        onBlur={handleBlur}
        errorText={errors.summonerName}
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
        data={championList}
        error={errors.champions}
        searchable
        onChange={(e) => onChange(e, "champions")}
      />
      <Textarea
        label="What made you want to apply as a mentor?"
        id="appReason"
        value={values.appReason}
        error={errors.appReason}
        onBlur={handleBlur}
      />

      <FormSelect
        title="Timezone"
        name="timezone"
        options={zones}
        onChange={onChange}
        error={errors.timezone}
      />

      <FormTextField
        title="Any additional information you would like the mentors to know (if nothing, leave blank)"
        id="info"
        placeholder="Info"
        value={values.info}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <button onClick={handleSubmit} disabled={loading}>
        Send Request
      </button>
    </StyledForm>
  );
};

export default FormEnhancer(MentorRequestForm);

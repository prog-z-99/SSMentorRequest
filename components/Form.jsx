import React, { useEffect } from "react";
import * as Yup from "yup";
import { withFormik } from "formik";
import { Button } from "@material-ui/core";
import { ranks, regions, roles } from "../util/datalist";
import { FormSelect, FormTextField, StyledForm } from "./Styles";
import axios from "axios";
import { useRouter } from "next/dist/client/router";

const FormEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    rank: Yup.string().required("Please select your Rank "),
    opgg: Yup.string().required("Please enter your OP.GG link"),
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

const UpdateAddress = (props) => {
  const { isValid, values, errors, handleChange, handleBlur, setFieldValue } =
    props;

  const router = useRouter();
  const handleSubmit = async () => {
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
  };

  const onChange = (obj, field) => {
    setFieldValue(field, obj.value);
  };

  const zones = timeZone();

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormSelect
        title="Rank"
        name="rank"
        options={ranks}
        onChange={onChange}
        error={errors.rank}
      />

      <FormSelect
        title="Region"
        name="region"
        options={regions}
        error={errors.region}
        onChange={onChange}
      />
      <FormTextField
        title="Op.gg (If Garena or another non op.gg region, simply insert summoner name)"
        id="opgg"
        placeholder="OP.GG"
        value={values.opgg}
        onChange={handleChange}
        onBlur={handleBlur}
        errorText={errors.opgg}
      />
      <FormSelect
        title="Role"
        name="role"
        options={roles}
        onChange={onChange}
        error={errors.role}
      />
      <FormTextField
        title="Champions"
        id="champions"
        placeholder="Champions"
        value={values.champions}
        onChange={handleChange}
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

      <Button onClick={handleSubmit}>check values</Button>
    </StyledForm>
  );
};

export default FormEnhancer(UpdateAddress);

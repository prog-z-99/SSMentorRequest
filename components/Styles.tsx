import { HoverCard, Select, TextInput, Text, Container } from "@mantine/core";
import axios from "axios";
import { Form } from "formik";
import React, { useState } from "react";
import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  min-height: 100vh;
  margin: 10px;
`;

export const FormWrapper = styled(Container)`
  display: flex;
  margin: 0 auto;
  align-items: center;
  flex-direction: column;
`;

export const MentorsWrapper = styled.div`
  flex-direction: column;
  fill: 100%;
`;

export const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 1em;
`;

const FieldWrapper = styled.div``;

const FieldInput = styled.input`
  height: 2em;
`;

export const ReqTableRow = styled.div`
  flex-direction: column;
`;

export const FormSelect = ({
  title,
  name,
  options,
  onChange,
  error,
  value,
}) => {
  return (
    <Select
      label={title}
      error={error}
      value={value}
      data={formatter(options)}
      onChange={(e) => onChange(e, name)}
    />
  );
};

export const FormTextField = ({ title, ...props }) => {
  return <TextInput label={title} {...props} />;
};

export const formatter = (list) => {
  return list.map((item) => {
    return { value: item, label: item };
  });
};

export const formatterColored = (list) => {
  return list.map((item) => {
    return { value: item, label: item, color: getStatusColor(item) };
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Not Accepted":
      return "gray";
    case "Completed":
      return "green";
    case "In-Progress":
      return "blue";
    case "Problem":
      return "red";
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case "Not Accepted":
      return "⬜";
    case "Completed":
      return "🟩";
    case "In-Progress":
      return "🟦";
    case "Problem":
      return "🟥";
  }
};

export const Expanded = styled.div`
  p {
    margin: 0;
  }
`;

export const Clickable = styled.a`
  cursor: link;
`;

export const Tooltip = styled.p`
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: -5px;
  left: 105%;
`;

export const Remarks = ({ id, content }) => {
  const [input, setInput] = useState(false);
  const [value, setValue] = useState(content);
  const handleType = ({ target: { value } }) => {
    setValue(value);
  };
  const handleSubmit = async () => {
    await axios.put(`/api/request/${id}`, {
      value,
      type: "remarks",
    });
    setInput(false);
  };
  return input ? (
    <FieldWrapper>
      <FieldInput value={value} onChange={handleType} />
      <button onClick={handleSubmit}>submit</button>
    </FieldWrapper>
  ) : (
    <FieldWrapper>
      <a onClick={() => setInput(true)}>Remarks: {value}</a>
    </FieldWrapper>
  );
};

export const ClickToCopy = ({ children }) => {
  return (
    <HoverCard>
      <HoverCard.Target>
        <Text>{children}</Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text>Click to copy</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

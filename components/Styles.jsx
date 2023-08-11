import { Loader, MultiSelect, Select, Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { copyClip } from "../util/helper";
import { getAllChampions } from "../util/helper";
import Layout from "./layout";
import styled from "@emotion/styled";

export const FormSelect = ({
  className,
  title,
  name,
  options,
  onChange,
  error,
  value,
}) => {
  return (
    <Select
      className={className}
      label={title}
      error={error}
      value={value}
      data={options}
      onChange={(e) => onChange(e, name)}
    />
  );
};

export const ChampionSelect = ({ className, onChange, error }) => {
  const [champions, setChampions] = useState([]);

  useEffect(() => {
    async function fetchChampions() {
      setChampions(await getAllChampions());
    }

    fetchChampions();
  }, []);

  return (
    <MultiSelect
      className={className}
      label={"Champions"}
      data={champions}
      searchable
      onChange={(e) => onChange(e, "champions")}
      error={error}
    />
  );
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

export const ClickToCopy = ({ children }) => {
  return (
    <Tooltip.Floating label="Click to copy">
      <a
        style={{ cursor: "pointer" }}
        onClick={() => {
          copyClip(children);
        }}
      >
        {children}
      </a>
    </Tooltip.Floating>
  );
};

export const StyledLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
`;

export const StyledClickableContainer = styled.div`
  cursor: pointer;
  display: flex;
`;
export const LoaderWithLayout = () => {
  return (
    <Layout>
      <Loader /> Loading
    </Layout>
  );
};

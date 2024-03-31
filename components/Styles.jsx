import { Loader, MultiSelect, Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { copyClip } from "../util/helper";
import { getAllChampions } from "../util/helper";
import Layout from "./layout";
import styled from "@emotion/styled";

export const ChampionSelect = (props) => {
  const [champions, setChampions] = useState([]);

  useEffect(() => {
    async function fetchChampions() {
      setChampions(await getAllChampions());
    }

    fetchChampions();
  }, []);

  return (
    <MultiSelect {...props} label="Champions" data={champions} searchable />
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

export const ClickToCopy = ({ children, data }) => {
  return (
    <Tooltip.Floating label="Click to copy">
      <a
        style={{ cursor: "pointer" }}
        onClick={() => {
          copyClip(data ? data: children);
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

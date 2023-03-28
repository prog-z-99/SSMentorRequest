import { HoverCard, Select, Text } from "@mantine/core";
import React from "react";

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
      data={options}
      onChange={(e) => onChange(e, name)}
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

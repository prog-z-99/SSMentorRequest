export const ranks = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Masters",
  "Grandmasters",
  "Challenger",
];

export const statuses = ["Not Accepted", "In-Progress", "Completed", "Problem"];

export const regions = [
  "BR",
  "EUW",
  "EUNE",
  "NA",
  "LAN",
  "LAS",
  "OCE",
  "RU",
  "TR",
  "JP",
  "Garena",
];

export const userType = ["user", "mentor", "admin"];

export const userSelectCommand = (type) => `SET_${type.toUpperCase()}`;

export const roles = ["Top", "Jungle", "Mid", "ADC", "Support"];

export const rtTitles = [
  "",
  "Created",
  "Discord Username",
  "OP.GG",
  "Rank",
  "Region",
  "Role",
  "Champions",
  "Timezone",
  "Status",
];

export const rtHeader = [
  { title: "" },
  {
    title: "Created",
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  },
  {
    title: "Discord Username",
    sorter: (a, b) => `${a.discordName}`.localeCompare(b.discordName),
  },
  { title: "OP.GG" },

  {
    title: "Rank",
    sorter: (a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank),
  },
  {
    title: "Region",
    sorter: (a, b) => a.region.localeCompare(b.region),
  },
  {
    title: "Role",
    sorter: (a, b) => a.role.localeCompare(b.role),
  },
  { title: "Champions" },
  { title: "Timezone", sorter: (a, b) => a.timezone.localeCompare(b.timezone) },
  {
    title: "Status",
    sorter: (a, b) => statuses.indexOf(a.status) - statuses.indexOf(b.status),
  },
];

export const rtFields = [
  "createdAt",
  "discordName",
  "summonerName",
  "rank",
  "region",
  "role",
  "champions",
  "timezone",
  "status",
];

export const requestTableFormat = rtTitles.map((t, i) => ({
  title: t,
  field: rtFields[i],
}));

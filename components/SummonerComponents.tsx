export const OPGGlink = ({ item }) => (
  <a
    href={`https://op.gg/summoners/${item.region}/${item.summonerName.replace(
      "#",
      "-"
    )}`}
    rel={"noreferrer"}
    target={"_blank"}
  >
    {item.summonerName}
  </a>
);

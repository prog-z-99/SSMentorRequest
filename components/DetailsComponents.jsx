import { Text } from "@mantine/core";

export const Comments = ({ comments }) => {
  return (
    <Text>
      {(comments?.length > 0 &&
        comments.map((comment, i) => (
          <Text key={`Comment${i}`}>
            <Text fs="italic" span>
              {comment.commenter.discordName}
            </Text>
            : {comment.content}
          </Text>
        ))) ||
        "N/A"}
    </Text>
  );
};

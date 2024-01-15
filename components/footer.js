import React from "react";
import { Text, Box, Divider } from '@mantine/core';


export default function Footer() {
  return (
    <footer>
      <Divider size='sm' />
      <Box p='md'>
        <Text color='dimmed' size='xs' fs='italic'>Made by @z_the_dev and @oldretiredfish</Text>
      </Box>
    </footer>
  );
}

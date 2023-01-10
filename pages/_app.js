import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import "./styles.css";
import dayjs from "dayjs";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

// Use the <Provider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }) {
  return (
    <SessionProvider refetchInterval={5 * 60} session={pageProps.session}>
      <MantineProvider>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
}

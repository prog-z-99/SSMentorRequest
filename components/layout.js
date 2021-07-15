import Header from "../components/header";
import Footer from "../components/footer";
import { PageWrappaer } from "./Styles";

export default function Layout({ children }) {
  return (
    <PageWrappaer>
      <Header />
      <main>{children}</main>
      <Footer />
    </PageWrappaer>
  );
}

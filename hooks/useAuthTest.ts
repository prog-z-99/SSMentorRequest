import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useAuthTest = (link: string, shouldBoot: boolean) => {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState({});
  const [notAuth, setNotAuth] = useState(false);
  useEffect(() => {
    switch (status) {
      case "unauthenticated":
        setLoading(false);
        setNotAuth(true);
        break;
      case "authenticated":
        axios
          .get(link)
          .then(({ data }) => {
            setData(data);
            setLoading(false);
          })
          .catch((error) => {
            setError(error);
            if (shouldBoot) router.push("/");
          });
    }
  }, [status, router, link, shouldBoot]);

  return {
    error,
    loading,
    notAuth,
    ...data,
  };
};

export default useAuthTest;

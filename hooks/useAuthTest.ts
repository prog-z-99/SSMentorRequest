import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useAuthTest = (link, shouldBoot) => {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState({});
  useEffect(() => {
    switch (status) {
      case "unauthenticated":
        router.push("/api/auth/signin");
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
    loading,
    error,
    ...data,
  };
};

export default useAuthTest;

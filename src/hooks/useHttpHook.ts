import { useState } from "react";

const useHttpHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = async (
    url: string,
    body: null | object = null
  ): Promise<any> => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: body ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });
      return await response.json();
    } catch (error) {
      setError(error);
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchData,
    isLoading,
    error,
  };
};

export default useHttpHook;

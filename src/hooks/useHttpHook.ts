import { useState } from "react";

const useHttpHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (
    url: string,
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      body?: object
    }
  ): Promise<any> => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: options?.method || 'GET',
        headers: {
          "Content-Type": "application/json",
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
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

import React, { useCallback, useEffect, useRef, useState } from "react";
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  // useCallback to avoid infinite loops;

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      // what if the request is still pending and we route to other page ,
      // in this scenario you'll try to update a component which is not in dom;
      // So use abort controller to cancel on going http request
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortController.signal, // pass signal to add our config
        });

        const responseData = await response.json();

        // Remove abort controller when the response is returned
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (requestCtrl) => requestCtrl !== httpAbortController
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        throw error;
      }
    },
    []
  );
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // when the request are on the way on u leave the component , then u have to cancle the requests
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    }; // clean up function
  }, []);
  return { isLoading, error, sendRequest, clearError };
};

"use client";

import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const currentTime = Date.now();

export const useConvexQuery = (query, ...args) => {
  const result = useQuery(query, ...args);

  const [data, setData] = useState(undefined);
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (result === undefined) {
      setIsloading(true);
    } else {
      try {
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsloading(false);
      }
    }
  }, [result]);

  return {
    data,
    isLoading,
    error,
  };
};

export const useConvexMutation = (mutation) => {
  const mutationFn = useMutation(mutation);

  const [data, setData] = useState(undefined);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...arg) => {
    setIsloading(true);
    setError(null);

    try {
      const res = await mutationFn(...arg);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsloading(false);
    }
  };

  return {
    mutate,
    data,
    isLoading,
    error,
  };
};

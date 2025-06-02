"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

export function withClientOnly<P extends object>(
  Component: React.ComponentType<P>
) {
  const ClientOnlyComponent = (props: P) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) {
      return null; // or a loading skeleton
    }

    return <Component {...props} />;
  };

  return dynamic(() => Promise.resolve(ClientOnlyComponent), {
    ssr: false,
  });
}

export function useClientOnly() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

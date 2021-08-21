import { useAppUrl } from "hooks/useAppUrl";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";

const FlagsContext = React.createContext({});

function FlagsProvider({ children, projectId }) {
  if (projectId === undefined) {
    throw new Error("FlagsProvider expects project id");
  }
  const [data, setData] = useState({ blah: 123 });
  const appUrl = useAppUrl();
  useEffect(() => {
    fetch(`${appUrl}/api/flags/${projectId}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [appUrl, projectId]);

  return <FlagsContext.Provider value={data}>{children}</FlagsContext.Provider>;
}

function useFlags() {
  const context = React.useContext(FlagsContext);
  if (context === undefined) {
    throw new Error("useFlags must be used within a FlagsProvider");
  }
  return context;
}

export { FlagsProvider, useFlags };

import { FeatureFlag } from "@prisma/client";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";

const FlagsContext = React.createContext({});

function FlagsProvider({ children, projectId }) {
  if (projectId === undefined) {
    throw new Error("FlagsProvider expects project id");
  }
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://flags.stackonfire.dev/api/flags/${projectId}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [projectId]);

  return <FlagsContext.Provider value={data}>{children}</FlagsContext.Provider>;
}

function useFlags() {
  const context = React.useContext(FlagsContext) as ReadonlyArray<FeatureFlag>;
  if (context === undefined) {
    throw new Error("useFlags must be used within a FlagsProvider");
  }
  return context;
}

export { FlagsProvider, useFlags };

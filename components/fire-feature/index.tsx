import React from "react";
import { useFlags } from "context/flags-context";

const FireFeature = ({ flagName, children }) => {
  const flags = useFlags();
  const foundFlag = flags.find((flag) => flag.name === flagName);
  if (!foundFlag) return null;
  return <div>{foundFlag.isActive ? children : null}</div>;
};

export default FireFeature;

import React from "react";
import { useFlags } from "context/flags-context";

const FireFeature = ({ flagName, children }) => {
  const flags = useFlags();
  const foundFlag = flags.find((flag) => flag.name === flagName);
  if (!foundFlag) return null;
  return foundFlag.isActive ? children : null;
};

export default FireFeature;

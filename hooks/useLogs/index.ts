import { getAppUrl } from "hooks/useAppUrl";
import { useQuery } from "react-query";

const fetchLogs = async (id) => {
  const appUrl = getAppUrl();
  const response = await fetch(`${appUrl}/api/logs/${id}`);
  const json = await response.json();

  return json;
};

const useLogs = ({ id }) => {
  return useQuery(["projects", id], () => fetchLogs(id));
};

export { useLogs, fetchLogs };

import { useAppUrl } from "hooks/useAppUrl";

import { useQuery } from "react-query";

const fetchProjects = async (appUrl) => {
  const response = await fetch(`${appUrl}/api/projects`);
  const json = await response.json();

  return json;
};

const useProjects = ({ skip }: { skip: boolean }) => {
  const appUrl = useAppUrl();
  return useQuery(["projects"], () => fetchProjects(appUrl), { enabled: skip });
};

export { useProjects, fetchProjects };

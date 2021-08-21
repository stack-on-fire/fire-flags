import { useAppUrl } from "hooks/useAppUrl";

import { useQuery } from "react-query";

const fetchProjects = async (appUrl) => {
  const response = await fetch(`${appUrl}/api/projects`);
  const json = await response.json();

  return json;
};

const useProjects = () => {
  const appUrl = useAppUrl();
  return useQuery(["projects"], () => fetchProjects(appUrl));
};

export { useProjects, fetchProjects };

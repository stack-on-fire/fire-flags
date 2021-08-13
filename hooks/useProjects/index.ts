import { useAppUrl } from "hooks/useAppUrl";

import { useQuery } from "react-query";

const fetchProjects = async () => {
  const appUrl = useAppUrl();
  const response = await fetch(`${appUrl}/api/projects`);
  const json = await response.json();

  return json;
};

const useProjects = () => {
  return useQuery(["projects"], fetchProjects);
};

export { useProjects, fetchProjects };

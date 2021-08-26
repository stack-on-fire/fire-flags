import { getAppUrl } from "hooks/useAppUrl";
import { useQuery } from "react-query";

const fetchProject = async (id) => {
  const appUrl = getAppUrl();
  const response = await fetch(`${appUrl}/api/project/${id}`);
  const json = await response.json();

  return json;
};

const useProject = ({ id }) => {
  return useQuery(["projects", id], () => fetchProject(id));
};

export { useProject, fetchProject };

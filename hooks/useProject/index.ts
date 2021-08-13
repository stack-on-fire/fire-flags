import { useQuery } from "react-query";

const fetchProject = async (id) => {
  const response = await fetch(`http://localhost:3000/api/project/${id}`);
  const json = await response.json();

  return json;
};

const useProject = ({ id }) => {
  return useQuery(["projects", id], () => fetchProject(id));
};

export { useProject, fetchProject };

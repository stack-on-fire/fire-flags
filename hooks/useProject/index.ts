import { useQuery } from "react-query";

const fetchProject = async (id) => {
  console.log("fetch project with id", id);
  const response = await fetch(`http://localhost:3000/api/project/${id}`);
  const json = await response.json();
  console.log("fetched", json);

  return json;
};

const useProject = ({ id }) => {
  return useQuery(["projects", id], () => fetchProject(id));
};

export { useProject, fetchProject };

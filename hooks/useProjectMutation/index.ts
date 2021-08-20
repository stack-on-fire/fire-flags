import { useAppUrl } from "hooks/useAppUrl";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { Project } from "@prisma/client";

type Variables = {
  id: Project["id"];
  toggleActive?: boolean;
  toggleArchive?: boolean;
  name?: string;
  description?: string;
};

const useProjectMutation = () => {
  const queryClient = useQueryClient();
  const appUrl = useAppUrl();
  return useMutation(
    async (variables: Variables) => {
      const response = await axios.post(
        `${appUrl}/api/project/update?id=${variables.id}`,
        {
          toggleArchive: variables.toggleArchive,
          name: variables.name,
          description: variables.description,
        }
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(["projects"]);
      },
    }
  );
};

export { useProjectMutation };

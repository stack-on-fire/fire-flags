import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { FeatureFlag } from "@prisma/client";

type Variables = {
  id: FeatureFlag["id"];
  toggleActive?: boolean;
  toggleArchive?: boolean;
  name?: string;
  description?: string;
};

const useFlagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (variables: Variables) => {
      const response = await axios.post(
        `http://localhost:3000/api/flag/update?id=${variables.id}`,
        {
          toggleActive: variables.toggleActive,
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

export { useFlagMutation };

import { useAppUrl } from "hooks/useAppUrl";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { Heat } from "@prisma/client";

type Environments = "development" | "staging" | "production";
type Variables = {
  id: Heat["id"];
  environments?: Environments[];
  users?: string[];
  deleteUserIds?: boolean;
};

const useHeatMutation = () => {
  const queryClient = useQueryClient();
  const appUrl = useAppUrl();
  return useMutation(
    async (variables: Variables) => {
      const response = await axios.post(
        `${appUrl}/api/heat/update?id=${variables.id}`,
        {
          payload: {
            environments: variables.environments,
            users: variables.users,
            deleteUserIds: variables.deleteUserIds,
          },
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

export { useHeatMutation };

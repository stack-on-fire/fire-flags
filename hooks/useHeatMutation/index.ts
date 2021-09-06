import { useAppUrl } from "hooks/useAppUrl";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { Heat } from "@prisma/client";

type Variables = {
  id: Heat["id"];
  values: string[];
  deleteValues?: boolean;
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
            values: variables.values,
            deleteValues: variables.deleteValues,
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

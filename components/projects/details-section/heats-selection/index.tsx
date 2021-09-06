import { Box, Radio, RadioGroup, VStack } from "@chakra-ui/react";
import React from "react";

const HeatsSelection = ({
  selectedFlag,
  selectedHeatOption,
  setSelectedHeatOption,
}) => {
  return (
    <Box>
      <RadioGroup
        value={selectedHeatOption}
        onChange={(e) => setSelectedHeatOption(e)}
        colorScheme="gray"
      >
        <VStack>
          <Radio
            isDisabled={selectedFlag.heats.some(
              (heat) => heat.type === "ENVIRONMENT"
            )}
            value="ENVIRONMENT"
          >
            Environment
          </Radio>
          <Radio
            isDisabled={selectedFlag.heats.some(
              (heat) => heat.type === "USER_INCLUDE"
            )}
            value="USER_INCLUDE"
          >
            Include users with ids
          </Radio>
          <Radio
            isDisabled={selectedFlag.heats.some(
              (heat) => heat.type === "USER_EXCLUDE"
            )}
            value="USER_EXCLUDE"
          >
            Exclude users with ids
          </Radio>
          <Radio value="CUSTOM">Custom heat</Radio>
        </VStack>
      </RadioGroup>
    </Box>
  );
};

export default HeatsSelection;

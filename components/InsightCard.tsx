import React from "react";
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";

interface InsightCardProps {
  title: string;
  value: number | string;
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  description,
}) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <Stat>
        <StatLabel fontSize="lg" fontWeight="medium">
          {title}
        </StatLabel>
        <StatNumber fontSize="3xl" fontWeight="bold">
          {value}
        </StatNumber>
        <StatHelpText>{description}</StatHelpText>
      </Stat>
    </Box>
  );
};

export default InsightCard;

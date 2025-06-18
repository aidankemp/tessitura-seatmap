import { Button, Flex, Menu, Text, Title } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState } from "react";

export const PerformanceDetailDialog = ({
  performanceName,
  performanceDate,
}: {
  performanceName: string;
  performanceDate: string;
}) => {
  const [opened, setOpened] = useState(false);

  const availabilityKey = (
    text: string,
    fillColor: string,
    strokeColor: string
  ) => (
    <Flex gap={20} align="center">
      <svg
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "18px",
          height: "18px",
        }}
      >
        <circle
          cx="9"
          cy="9"
          r="6"
          style={{
            strokeWidth: "5px",
            stroke: strokeColor,
            fill: fillColor,
          }}
        ></circle>
      </svg>
      <Text size="sm">{text}</Text>
    </Flex>
  );

  return (
    <Menu opened={opened} position="bottom-end" offset={0} withinPortal={false}>
      <Menu.Target>
        <Button
          variant="white"
          color="black"
          size="xs"
          rightSection={
            opened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />
          }
          onClick={() => setOpened((o) => !o)}
        >
          See details
        </Button>
      </Menu.Target>

      <Menu.Dropdown style={{ zIndex: 0 }}>
        <Flex direction="column" gap={10} p="md" maw="275px">
          <Title order={2} size="xl" textWrap="balance">
            {performanceName}
          </Title>
          <Title order={3} size="sm" textWrap="balance">
            {performanceDate}
          </Title>
        </Flex>
        <Flex
          direction="column"
          gap={10}
          p="md"
          maw="275px"
          style={{ borderTop: "1px solid #cecece" }}
        >
          {availabilityKey("Available", "#fff", "#9b98e5")}
          {availabilityKey("Selected", "#9b98e5", "#9b98e5")}
          {availabilityKey("Not available", "#bfbfbf", "#bfbfbf")}
        </Flex>
      </Menu.Dropdown>
    </Menu>
  );
};

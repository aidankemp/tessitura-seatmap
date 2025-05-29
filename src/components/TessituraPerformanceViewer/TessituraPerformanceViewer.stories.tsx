import type { Meta, StoryObj } from "@storybook/react";
import { TessituraPerformanceViewer } from "./TessituraPerformanceViewer";
import { tessituraApiMockHandlers } from "../../fixtures/tessituraApiMockHandlers";

const meta = {
  title: "TessituraPerformanceViewer",
  component: TessituraPerformanceViewer,
  tags: ["autodocs"],
} satisfies Meta<typeof TessituraPerformanceViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PerformanceViewer: Story = {
  args: {
    endpoint: "https://sample-endpoint.com",
    svg: "amazing-venue.svg",
    performanceId: 1,
    viewFromSeat: "/viewFromSeat.json",
  },
  parameters: {
    msw: {
      handlers: tessituraApiMockHandlers,
    },
  },
};

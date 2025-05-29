import type { Meta, StoryObj } from "@storybook/react";
import { TessituraPerformanceViewer as TessituraPerformanceViewerComponent } from "./TessituraPerformanceViewer";
import { tessituraApiMockHandlers } from "../../fixtures/tessituraApiMockHandlers";

const meta = {
  title: "TessituraPerformanceViewer",
  component: TessituraPerformanceViewerComponent,
} satisfies Meta<typeof TessituraPerformanceViewerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TessituraPerformanceViewer: Story = {
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

import type { Meta, StoryObj } from "@storybook/react";
import { TessituraSYOS } from "./TessituraSYOS";
import { tessituraApiMockHandlers } from "../../fixtures/tessituraApiMockHandlers";

const meta = {
  title: "TessituraSYOS",
  component: TessituraSYOS,
  tags: ["autodocs"],
} satisfies Meta<typeof TessituraSYOS>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SYOS: Story = {
  args: {
    endpoint: "https://sample-endpoint.com",
    svg: "amazing-venue.svg",
    performanceId: 1,
    facilityId: 1,
    viewFromSeat: "/viewFromSeat.json",
  },
  parameters: {
    msw: {
      handlers: tessituraApiMockHandlers,
    },
  },
};

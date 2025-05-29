import type { Meta, StoryObj } from "@storybook/react";
import { TessituraSYOS as TessituraSYOSComponent } from "./TessituraSYOS";
import { tessituraApiMockHandlers } from "../../fixtures/tessituraApiMockHandlers";

const meta = {
  title: "TessituraSYOS",
  component: TessituraSYOSComponent,
} satisfies Meta<typeof TessituraSYOSComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TessituraSYOS: Story = {
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

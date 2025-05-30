import type { Preview } from "@storybook/react";

import { initialize, mswLoader } from "msw-storybook-addon";

initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["TessituraSYOS", "TessituraPerformanceViewer"],
      },
    },
  },
  loaders: [mswLoader],
};

export default preview;

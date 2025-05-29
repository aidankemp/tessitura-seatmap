# tessitura-seatmap

[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](https://main--6838505ddf319835cf794a26.chromatic.com) [![NPM Version](https://img.shields.io/npm/v/tessitura-seatmap)](https://www.npmjs.com/package/tessitura-seatmap)

Tessitura-integrated seatmap component that can be customized for any transaction path.

Built with React, [Mantine UI](https://mantine.dev/), and [react-svg-seatmap](https://www.npmjs.com/package/react-svg-seatmap)

This package includes:

- `TessituraSYOS`: Use an SVG seatmap and a Tessitura performance ID to allow customers to add seats to their cart

![TessituraSYOS-Demo](https://github.com/user-attachments/assets/0a47e445-d1e9-42fb-9ea9-023eaba2683e)


- `TessituraPerformanceViewer`: View each layer of a performance's seatmap using live data, including availability, zone groups, and hold codes

![TessituraPerformanceViewer-Demo](https://github.com/user-attachments/assets/5a194de0-e76c-4f75-af1d-f75bed4c5cb6)

Check it out here: [Storybook](https://main--6838505ddf319835cf794a26.chromatic.com)

## Installation

Install the package via NPM:

```
npm install --save tessitura-seatmap
```

## Usage

**TessituraSYOS**

```jsx
import { TessituraSYOS } from "tessitura-seatmap";

export default () => (
  <TessituraSYOS
    svg="https://www.test.com/svg" // The URL of the SVG to use as the basis for the seatmap
    endpoint="https://sample-endpoint.com" // The Tessitura REST API endpoint to use for SYOS
    performanceId={1} // ID of the performance the customer is selecting seats for
    facilityId={1} // ID of the facility associated with the performance
  />
);
```

**TessituraPerformanceViewer**

```jsx
import { TessituraPerformanceViewer } from "tessitura-seatmap";

export default () => (
  <TessituraPerformanceViewer
    svg="https://www.test.com/svg" // The URL of the SVG to use as the basis for the seatmap
    endpoint="https://sample-endpoint.com" // The Tessitura REST API endpoint to use for fetching performance data
    performanceId={1} // ID of the performance to view
  />
);
```

## Props

The following props are available for both `TessituraSYOS` and `TessituraPerformanceViewer` components.

| Name          | Type   | Description                                                                                                                                                                                                                                                         |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| svg           | string | URL for an svg to render as the seatmap                                                                                                                                                                                                                             |
| endpoint      | string | URL of the Tessitura REST API endpoint to use for fetching performance data. Since this component renders client-side, this endpoint must be publicly accessible                                                                                                    |
| performanceId | number | The ID of the performance being mapped onto the SVG seatmap. For `TessituraSYOS`, this is the performance that customers will be purchasing seats in. For `TessituraPerformanceViewer`, this is the performance that will be broken down into layers on the seatmap |
| facilityId    | string | The ID of the facility associated with the the performance. Currently, this is only required for `TessituraSYOS`                                                                                                                                                       |

## License

[MIT Licence](LICENSE.md)

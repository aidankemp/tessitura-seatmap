import { TessituraPerformanceViewerProps } from "./TessituraPerformanceViewer.types";
import { useEffect, useMemo, useState } from "react";

import "react-svg-seatmap/style.css";
import { Seat, SeatmapAccordion } from "react-svg-seatmap";

import { createTheme, MantineProvider, Tabs } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { TessituraSeat } from "../../types/tessituraClient.types";
import { TessituraClient } from "../../services/tessituraClient";

type SeatTabs =
  | "allocations"
  | "screens"
  | "sections"
  | "zones"
  | "holds"
  | "seatType"
  | "stairs";

export const TessituraPerformanceViewer = ({
  endpoint,
  performanceId,
  svg,
}: TessituraPerformanceViewerProps) => {
  const [, setCurrentSeatId] = useState<number | null>(null);

  const seatTabs: SeatTabs[] = [
    "allocations",
    "screens",
    "sections",
    "zones",
    "holds",
    "seatType",
    "stairs",
  ];
  const [selectedTab, setSelectedTab] = useState<SeatTabs | null>(
    "allocations"
  );

  const [seatAndGroups, setSeatAndGroups] = useState<
    Record<string, { seats: Seat[]; groupMapping: Record<string, string> }>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTessituraData = async () => {
      try {
        console.log("Fetching data...");
        const tessituraClient = new TessituraClient(endpoint);
        const performanceIdString = performanceId.toString();
        const seats = await tessituraClient.getPerformanceSeats(
          performanceIdString
        );
        setLoading(false);
        return seats;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const setSeatAndGroupData = (tessituraSeats: TessituraSeat[]) => {
      const tabToSeatPropertyMap = {
        allocations: "SeatStatusId",
        screens: "ScreenId",
        sections: "SectionId",
        zones: "ZoneId",
        holds: "HoldCodeId",
        seatType: "SeatTypeId",
        stairs: "HasStairs",
      };

      const seatAndGroupsData = {} as Record<
        string,
        { seats: Seat[]; groupMapping: Record<string, string> }
      >;
      for (const tab of seatTabs) {
        const seatPropertyToDisplay = tabToSeatPropertyMap[
          tab || "allocations"
        ] as keyof TessituraSeat;

        const seatData = tessituraSeats.map((seat) => ({
          id: seat.Id,
          cssSelector: `#seat-${seat.SeatNumber}-${seat.SeatRow.replace(
            "*",
            "_"
          )}-${seat.ScreenId}`,
          displayGroup:
            seatPropertyToDisplay === "HasStairs"
              ? seat.HasStairs
                ? "Has Stairs"
                : "No Stairs"
              : seat[seatPropertyToDisplay].toString(),
        }));

        const displayGroupMapping = seatData.reduce((acc, seat) => {
          const displayGroup = seat.displayGroup;
          if (!acc[displayGroup]) {
            acc[displayGroup] = getNiceColor(Object.keys(acc).length);
          }
          return acc;
        }, {} as Record<string, string>);

        seatAndGroupsData[tab] = {
          seats: seatData,
          groupMapping: displayGroupMapping,
        };
      }

      setSeatAndGroups(seatAndGroupsData);
    };
    fetchTessituraData().then((seats) => {
      setSeatAndGroupData(seats);
      console.log("Finished fetching data");
    });
  }, [endpoint, performanceId]);

  const getNiceColor = (index: number) => {
    const colors = [
      "#5a8ef7",
      "#de5472",
      "#9b98e5",
      "#f8d376",
      "#e89171",
      "#72a588",
      "#abd0f1",
      "#61d4a4",
      "#f7b7a3",
      "#b5ead7",
      "#ffdac1",
      "#c7ceea",
      "#ffb7b2",
      "#b2f7ef",
      "#f6abb6",
      "#b5ead7",
      "#c9cba3",
      "#ffe156",
      "#6a0572",
      "#ab83a1",
      "#f67280",
      "#355c7d",
      "#99b898",
      "#f8b195",
      "#f6cd61",
      "#3ec300",
      "#f9d423",
      "#e27d60",
      "#85dcb0",
      "#e8a87c",
      "#c38d9e",
      "#41b3a3",
      "#f38181",
      "#a8e063",
      "#f7cac9",
      "#92a8d1",
      "#f9b7b7",
      "#b8a9c9",
      "#ffb347",
      "#b2d7e4",
    ];
    return colors[index % colors.length];
  };

  const { seatData, displayGroupMapping } = useMemo(() => {
    const seatData = seatAndGroups[selectedTab || "allocations"]?.seats || [];
    const displayGroupMapping =
      seatAndGroups[selectedTab || "allocations"]?.groupMapping || {};

    return { seatData, displayGroupMapping };
  }, [seatAndGroups, selectedTab]);

  const theme = createTheme({});

  const seatmap = useMemo(() => {
    const handleClick = (selectedSeat: number, selected: boolean) => {
      if (selected) setCurrentSeatId(selectedSeat);
      else setCurrentSeatId(null);
    };

    return (
      <SeatmapAccordion
        svg={svg}
        seats={!loading ? seatData : []}
        onClick={handleClick}
        displayGroupMapping={displayGroupMapping}
      />
    );
  }, [displayGroupMapping, loading, seatData, svg]);

  return (
    <MantineProvider theme={theme}>
      <Tabs
        variant="outline"
        value={selectedTab}
        onChange={(value) =>
          setSelectedTab(
            value as
              | "allocations"
              | "screens"
              | "sections"
              | "zones"
              | "holds"
              | "seatType"
              | "stairs"
              | null
          )
        }
      >
        <Tabs.List justify="flex-end">
          <Tabs.Tab value="allocations">Availability</Tabs.Tab>
          <Tabs.Tab value="screens">Screens</Tabs.Tab>
          <Tabs.Tab value="sections">Sections</Tabs.Tab>
          <Tabs.Tab value="zones">Zones</Tabs.Tab>
          <Tabs.Tab value="holds">Holds</Tabs.Tab>
          <Tabs.Tab value="seatType">Seat Type</Tabs.Tab>
          <Tabs.Tab value="stairs">Stairs</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      {seatmap}
    </MantineProvider>
  );
};

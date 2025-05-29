export type GroupingOptions = "zone" | "zoneGroup" | "screen" | "section";

export interface TessituraSYOSProps {
  endpoint: string;
  performanceId: number;
  facilityId: number;
  svg: string;
  viewFromSeat?: string;
  groupBy?: GroupingOptions;
}

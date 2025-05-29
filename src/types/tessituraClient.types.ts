export interface TessituraSeat {
  Id: number;
  SectionId: number;
  SeatRow: string;
  SeatNumber: string;
  ZoneId: number;
  AllocationId: number;
  SeatTypeId: number;
  LogicalSeatRow: number;
  LogicalSeatNumber: number;
  XPosition: number;
  YPosition: number;
  IsSeat: boolean;
  SeatStatusId: number;
  AisleIndicator: string;
  HasStairs: boolean;
  ScreenId: number;
  DisplayLetter: string;
  HoldCodeId: number;
}

type HouseMapRectangle = {
  XCoordinate: number;
  YCoordinate: number;
  Height: number;
  Width: number;
  BrushColor: number;
  PenColor: number;
  TextColor: number;
  TextXCoordinate: number;
  TextYCoordinate: number;
  TextText: string;
};

export type FacilityScreen = {
  Id: number;
  Description: string;
  RowCount: number;
  ColumnCount: number;
  ScreenUp: number;
  ScreenDown: number;
  ScreenLeft: number;
  ScreenRight: number;
  HouseMapRectangles: HouseMapRectangle[];
};

export type getFacilityScreensResponse = {
  Id: number;
  Description: string;
  Screens: FacilityScreen[];
};

export type PerformancePriceType = {
  PerformanceId: number;
  PackageId: number;
  ZoneId: number;
  PriceTypeId: number;
  Price: number;
  Enabled: boolean;
  IsEditable: boolean;
  LayerTypeId: number | null;
  IsEditableForWeb: boolean;
  EditableMinPrice: number;
  IsBase: boolean;
  ParentPackageId: number;
  PerformancePriceTypeId: number;
  MinPrice: number;
  IsBest: boolean;
  Offer: boolean;
  ModeOfSaleOfferId: number;
};

export type getPerformancePriceTypesResponse = PerformancePriceType[];

export type PriceTypeDetails = {
  PriceTypeId: number;
  AliasDescription: string;
  PerformanceId: number;
  PackageId: number;
  SuperPackageId: number;
  Description: string;
  ReasonIndicator: boolean;
  ShortDescription: string;
  DefaultIndicator: boolean;
  IsBest: boolean;
  Offer: boolean;
  Rank: number;
  MaxSeats: number;
  Terms: string | null;
};

export type getPriceTypeDetailsResponse = PriceTypeDetails[];

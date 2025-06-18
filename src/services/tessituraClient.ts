import { getFacilityScreensResponse } from "../types/tessituraClient.types";

export class TessituraClient {
  #baseUrl: string;

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #fetch = async (endpoint: string): Promise<any> => {
    const response = await fetch(`${this.#baseUrl}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  };

  getPerformanceDetails = async (performanceId: string) => {
    return this.#fetch(`TXN/Performances/${performanceId}`);
  };

  getPerformanceSeats = async (
    performanceId: string,
    constituentId?: number,
    modeOfSaleId?: number
  ) => {
    return this.#fetch(
      `TXN/Performances/${performanceId}/Seats?constituentId=${constituentId}&modeOfSaleId=${modeOfSaleId}&performanceId=${performanceId}`
    );
  };

  getZoneAvailability = async (performanceId: string) => {
    return this.#fetch(
      `TXN/Performances/ZoneAvailabilities?performanceIds=${performanceId}`
    );
  };

  getPerformancePriceTypes = async (
    performanceId: string,
    modeOfSaleId?: number,
    sourceId?: number
  ) => {
    return this.#fetch(
      `TXN/Performances/Prices?modeOfSaleId=${modeOfSaleId}&performanceIds=${performanceId}&sourceId=${sourceId}`
    );
  };

  getPriceTypeDetails = async (
    performanceId: string,
    modeOfSaleId?: number,
    sourceId?: number
  ) => {
    return this.#fetch(
      `TXN/PriceTypes/Details?modeOfSaleId=${modeOfSaleId}&performanceIds=${performanceId}&sourceId=${sourceId}`
    );
  };

  getFacilityScreens = async (
    facilityId: string
  ): Promise<getFacilityScreensResponse> => {
    return this.#fetch(`TXN/Facilities/${facilityId}/Screens`);
  };

  getSeatStatuses = async () => {
    return this.#fetch(`ReferenceData/SeatStatuses`);
  };
}

import { http, HttpResponse, delay } from "msw";
import { SeatData } from "./tessituraApiMockSeats";
import {
  PerformanceDetails,
  PriceData,
  PriceTypeData,
  ScreenData,
  ZoneAvailabilityData,
} from "./tessituraApiMockData";

export const tessituraApiMockHandlers = [
  http.get(
    "https://sample-endpoint.com/TXN/Performances/1/Seats?constituentId=0&modeOfSaleId=19&performanceId=1",
    async () => {
      await delay(500);
      return HttpResponse.json(SeatData);
    }
  ),
  http.get("https://sample-endpoint.com/TXN/Performances/1", async () => {
    await delay(500);
    return HttpResponse.json(PerformanceDetails);
  }),
  http.get(
    "https://sample-endpoint.com/TXN/Performances/ZoneAvailabilities?performanceIds=1",
    async () => {
      await delay(500);
      return HttpResponse.json(ZoneAvailabilityData);
    }
  ),
  http.get(
    "https://sample-endpoint.com/TXN/Performances/Prices?modeOfSaleId=19&performanceIds=1&sourceId=214",
    async () => {
      await delay(500);
      return HttpResponse.json(PriceData);
    }
  ),
  http.get(
    "https://sample-endpoint.com/TXN/PriceTypes/Details?modeOfSaleId=19&performanceIds=1&sourceId=214",
    async () => {
      await delay(500);
      return HttpResponse.json(PriceTypeData);
    }
  ),
  http.get("https://sample-endpoint.com/TXN/Facilities/1/Screens", async () => {
    await delay(500);
    return HttpResponse.json(ScreenData);
  }),
  http.get("https://sample-endpoint.com/Amazing-Venue_seat-*", async () => {
    return HttpResponse.json(
      {},
      {
        status: 301,
        headers: {
          location:
            "https://images.unsplash.com/photo-1519683109079-d5f539e1542f",
        },
      }
    );
  }),
];

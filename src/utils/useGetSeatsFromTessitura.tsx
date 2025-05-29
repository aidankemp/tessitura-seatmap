import { useEffect, useState } from "react";
import { Seat } from "react-svg-seatmap";
import { TessituraSeat } from "../types/tessituraClient.types";

export const useGetSeatsFromTessitura = (
  endpoint: string,
  performanceId: number,
  constituentId?: number,
  modeOfSaleId?: number
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tessituraSeatData, setTessituraSeatData] = useState<TessituraSeat[]>(
    []
  );

  useEffect(() => {
    const fetchTessituraData = async () => {
      try {
        console.log("Fetching data...");
        const response = await fetch(
          `${endpoint}/TXN/Performances/${performanceId}/Seats?constituentId=${constituentId}&modeOfSaleId=${modeOfSaleId}&performanceId=${performanceId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const seatData = await response.json();

        console.log("Finished fetching data");

        if (!seatData) {
          return [];
        }

        return seatData;
      } catch (error) {
        setLoading(false);
        setError("Failed to fetch data");
        console.error(error);
      }
    };
    fetchTessituraData().then((seats) => {
      setTessituraSeatData(seats);
      setLoading(false);
    });
  }, [constituentId, endpoint, modeOfSaleId, performanceId]);

  return { loading, data: tessituraSeatData, error };
};

export const tessituraDataToSeat = (seats: TessituraSeat[]) => {
  return seats
    .filter((seat: TessituraSeat) => seat.SeatStatusId === 0)
    .map((seat: TessituraSeat) => {
      return {
        id: seat.Id,
        // name: seat.SeatNumber,
        available: seat.AllocationId === 0,
        displayGroup: seat.ZoneId.toString(),
        selectionGroups: {
          row: { value: seat.SeatRow, parent: "section" },
          section: seat.ScreenId.toString(),
        },
        cssSelector: `#seat-${seat.SeatNumber}-${seat.SeatRow.replace(
          "*",
          "_"
        )}-${seat.ScreenId}`,
      } as Seat;
    });
};

import { useEffect, useState } from "react";

type ViewFromSeatFacility = {
  facility_no: string;
  seat_images: string[];
};

type SeatImageData = {
  url: string;
  facilityId: string;
  screenId: number;
  rowName: string;
  seatName: string;
};

export const useViewFromSeat = (endpoint?: string) => {
  const [seatImages, setSeatImages] = useState<SeatImageData[]>(); // This matches seat IDs to image URLs

  // Fetch the file containing all the references to seat images
  useEffect(() => {
    const fetchSeatImages = async () => {
      try {
        if (!endpoint) return;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const mappedSeats = mapImagesToSeats(data.facilities);
        console.log("Mapped seat images:", mappedSeats);
        setSeatImages(mappedSeats);
      } catch (error) {
        console.error("Error fetching seat images:", error);
      }
    };

    fetchSeatImages();
  }, [endpoint]);

  const mapImagesToSeats = (data: ViewFromSeatFacility[]) => {
    return data.flatMap((facility) =>
      facility.seat_images.reduce((acc: SeatImageData[], imageUrl: string) => {
        // Extract the file name from the image URL
        const fileName = imageUrl.split("/").pop();

        // Extact the seat information from the file name,
        // assuming the file name ends with a format like "seat-{seatName}-{rowName}-{screenId}"
        const fileNameSplit = fileName?.split("seat");
        if (!fileNameSplit) {
          console.error("Invalid file name format:", fileName);
          return acc;
        }
        const seatInfo = fileNameSplit[fileNameSplit.length - 1].split("-");
        if (seatInfo.length < 4) {
          console.error("Invalid seat information format:", seatInfo);
          return acc;
        }

        return [
          {
            url: imageUrl,
            facilityId: facility.facility_no,
            screenId: parseInt(seatInfo[3], 10),
            rowName: seatInfo[2],
            seatName: seatInfo[1],
          },
          ...acc,
        ];
      }, [])
    );
  };

  return {
    seatImages,
  };
};

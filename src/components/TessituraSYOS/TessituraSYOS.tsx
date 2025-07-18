import { TessituraSYOSProps } from "./TessituraSYOS.types";
import { useEffect, useMemo, useState } from "react";
import "react-svg-seatmap/style.css";
import "./TessituraSYOS.scss";
import { SeatmapAccordion } from "react-svg-seatmap";

import {
  Button,
  createTheme,
  MantineProvider,
  Modal,
  Skeleton,
  Space,
  Text,
} from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { IconShoppingCart } from "@tabler/icons-react";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
  TessituraSeat,
  FacilityScreen,
  getFacilityScreensResponse,
  getPerformancePriceTypesResponse,
  getPriceTypeDetailsResponse,
  PerformancePriceType,
  getPerformanceDetailsResponse,
} from "../../types/tessituraClient.types";
import { TessituraClient } from "../../services/tessituraClient";
import {
  tessituraDataToSeat,
  useGetSeatsFromTessitura,
} from "../../utils/useGetSeatsFromTessitura";
import { useViewFromSeat } from "../../utils/useViewFromSeat";
import { getNiceColor } from "../../utils/getNiceColor";
import { PerformanceDetailDialog } from "./PerformanceDetailDialog";

type TessituraDataStore = {
  performanceDetails: getPerformanceDetailsResponse;
  zoneAvailability: unknown; // TODO: Replace with actual type
  performancePrices: getPerformancePriceTypesResponse;
  priceTypeDetails: getPriceTypeDetailsResponse;
  facilityScreens: getFacilityScreensResponse;
};

export const TessituraSYOS = ({
  endpoint,
  performanceId,
  facilityId,
  svg,
  viewFromSeat,
  constituentId,
  modeOfSaleId,
  sourceId,
}: TessituraSYOSProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [currentSeat, setCurrentSeat] = useState<{
    id: number;
    action: "selecting" | "deselecting";
  } | null>(null);
  const { data: tessituraSeats, loading } = useGetSeatsFromTessitura(
    endpoint,
    performanceId,
    constituentId,
    modeOfSaleId
  );
  const { seatImages } = useViewFromSeat(viewFromSeat);
  const [imageLoading, setImageLoading] = useState(true);
  const [priceTypeLoading, setPriceTypeLoading] = useState("");

  const [tessituraDataStore, setTessituraDataStore] =
    useState<TessituraDataStore | null>(null);

  // Hydrate data from the Tessitura API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tessituraClient = new TessituraClient(endpoint);
        const performanceIdString = performanceId.toString();
        const fetchPromises = [
          tessituraClient.getPerformanceDetails(performanceIdString),
          tessituraClient.getZoneAvailability(performanceIdString),
          tessituraClient.getPerformancePriceTypes(
            performanceIdString,
            modeOfSaleId,
            sourceId
          ),
          tessituraClient.getPriceTypeDetails(
            performanceIdString,
            modeOfSaleId,
            sourceId
          ),
          tessituraClient.getFacilityScreens(facilityId.toString()),
        ];

        Promise.all(fetchPromises).then(
          ([
            performanceDetails,
            zoneAvailability,
            performancePrices,
            priceTypeDetails,
            facilityScreens,
          ]) => {
            setTessituraDataStore({
              performanceDetails,
              zoneAvailability,
              performancePrices,
              priceTypeDetails,
              facilityScreens,
            });
          }
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [endpoint, performanceId, tessituraSeats]);

  const getPriceTypesForSeat = (seatId: number) => {
    if (tessituraDataStore && tessituraDataStore.performancePrices) {
      const seat = tessituraSeats.find(
        (seat: TessituraSeat) => seat.Id === seatId
      );
      const priceTypes = tessituraDataStore.performancePrices.filter(
        (price: PerformancePriceType) =>
          price.ZoneId === seat?.ZoneId && price.Enabled === true
      );
      return priceTypes;
    }
    return null;
  };

  const getImageForSeat = (seatId: number) => {
    const seat = tessituraSeats.find(
      (seat: TessituraSeat) => seat.Id === seatId
    );

    if (seat) {
      const imagesInRow = seatImages?.filter(
        (image) =>
          image.facilityId === facilityId.toString() &&
          image.screenId === seat.ScreenId &&
          image.rowName === seat.SeatRow
      );

      console.log("imagesInRow", imagesInRow);

      if (imagesInRow?.length === 0) {
        return null;
      }

      const seatNumber = parseInt(seat.SeatNumber);
      const closestSeatImage = imagesInRow?.reduce(function (prev, curr) {
        const currentSeatNumber = parseInt(curr.seatName);
        const prevSeatNumber = parseInt(prev.seatName);
        return Math.abs(currentSeatNumber - seatNumber) <
          Math.abs(prevSeatNumber - seatNumber)
          ? curr
          : prev;
      });

      return closestSeatImage ? closestSeatImage.url : null;
    }
  };

  const handleClick = (selectedSeat: number, selected: boolean) => {
    setCurrentSeat({
      id: selectedSeat,
      action: selected ? "selecting" : "deselecting",
    });
    setShowModal(true);
    setImageLoading(true);
  };

  const priceTypeSelector = (priceTypeName: string, priceTypePrice: number) => (
    <div className="price-types__selector">
      <div className="price-types__description">
        <Text>{priceTypeName}</Text>
        <Text fw={700}>
          {priceTypePrice.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
      </div>
      <div className="price-types__action">
        <Button
          variant="outline"
          color="black"
          loading={priceTypeLoading === priceTypeName}
          onClick={() => {
            if (currentSeat) {
              setSelectedSeatIds((prev) => [...prev, currentSeat.id]);
              setPriceTypeLoading(priceTypeName);
              setTimeout(() => {
                setPriceTypeLoading("");
                setShowModal(false);
                const seat = tessituraSeats.find(
                  (seat: TessituraSeat) => seat.Id === currentSeat.id
                );
                if (seat) {
                  const seatScreen =
                    tessituraDataStore?.facilityScreens.Screens.find(
                      (screen: FacilityScreen) => screen.Id === seat?.ScreenId
                    );
                  notifications.show({
                    title: "Added to cart",
                    message: `${
                      seatScreen
                        ? seatScreen.Description.toUpperCase() + ", "
                        : ""
                    }Seat ${seat.SeatNumber}, Row ${
                      seat.SeatRow
                    }, ${priceTypeName}`,
                    position: "top-right",
                    icon: <IconShoppingCart size="1rem" />,
                    autoClose: 10000,
                  });
                }
              }, 2000);
            }
          }}
        >
          Select
        </Button>
      </div>
    </div>
  );

  const modalTitle = () => {
    if (currentSeat) {
      const seat = tessituraSeats.find(
        (seat: TessituraSeat) => seat.Id === currentSeat.id
      );

      if (tessituraDataStore && tessituraDataStore.facilityScreens) {
        const seatScreen = tessituraDataStore.facilityScreens.Screens.find(
          (screen: FacilityScreen) => screen.Id === seat?.ScreenId
        );
        const screenText = seatScreen?.Description.toUpperCase();

        return `${screenText}, Row ${seat?.SeatRow}, Seat ${seat?.SeatNumber}`;
      }
      return `Row ${seat?.SeatRow}, Seat ${seat?.SeatNumber}`;
    }
  };

  const modalContent = () => {
    if (currentSeat) {
      if (currentSeat.action === "selecting") {
        const priceTypes = getPriceTypesForSeat(currentSeat.id);
        if (!priceTypes) return null;

        const seatImageUrl = getImageForSeat(currentSeat.id);

        return (
          <div className="seat-details">
            {seatImageUrl && (
              <div className="view-from-seat">
                <Skeleton
                  visible={imageLoading}
                  className="view-from-seat__skeleton"
                >
                  <img
                    src={seatImageUrl}
                    alt={`View from seat ${currentSeat.id}`}
                    className="view-from-seat__image"
                    onLoad={() => setImageLoading(false)}
                  />
                </Skeleton>
              </div>
            )}
            <div className="price-types">
              {priceTypes.map((priceType: PerformancePriceType) => {
                const priceTypeDetail =
                  tessituraDataStore?.priceTypeDetails.find(
                    (priceTypeDetail) =>
                      priceTypeDetail.PriceTypeId === priceType.PriceTypeId
                  );
                if (!priceTypeDetail) return null;

                return priceTypeSelector(
                  priceTypeDetail.AliasDescription,
                  priceType.Price
                );
              })}
            </div>
          </div>
        );
      } else if (currentSeat.action === "deselecting") {
        return (
          <>
            <Text size="sm">You have already selected this seat.</Text>
            <Space h="md" />
            <Button
              color="black"
              onClick={() => {
                setSelectedSeatIds((prev) =>
                  prev.filter((id) => id !== currentSeat.id)
                );
                setShowModal(false);
                notifications.show({
                  title: "Removed from cart",
                  color: "red",
                  message: `Seat ${currentSeat.id} has been removed from your cart.`,
                  position: "top-right",
                  icon: <IconShoppingCart size="1rem" />,
                  autoClose: 10000,
                });
              }}
            >
              Remove Seat
            </Button>
          </>
        );
      }
    }
    return null;
  };

  const seatData = useMemo(() => {
    if (loading || !tessituraSeats) {
      return [];
    }
    const seats = tessituraDataToSeat(tessituraSeats);
    console.log(seats);
    return seats;
  }, [tessituraSeats]);

  const displayGroupMapping = useMemo(() => {
    if (loading || !tessituraSeats) {
      return {};
    }
    const displayGroupMapping = seatData.reduce((acc, seat) => {
      const displayGroup = seat.displayGroup;
      if (displayGroup && !acc[displayGroup]) {
        acc[displayGroup] = getNiceColor(Object.keys(acc).length);
      }
      return acc;
    }, {} as Record<string, string>);

    return displayGroupMapping;
  }, [tessituraSeats]);

  const theme = createTheme({
    headings: {
      sizes: {
        h3: {
          fontWeight: "normal",
        },
      },
    },
  });

  return (
    <MantineProvider theme={theme}>
      <Notifications portalProps={{ target: ".seatmap" }} />
      <SeatmapAccordion
        svg={svg}
        seats={!loading ? seatData : []}
        selectedSeatIds={selectedSeatIds}
        onClick={handleClick}
        displayGroupMapping={displayGroupMapping}
        rightControls={[
          <PerformanceDetailDialog
            performanceName={
              tessituraDataStore?.performanceDetails?.Description || "ERROR"
            }
            performanceDate={
              (tessituraDataStore?.performanceDetails.Date
                ? new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "full",
                    timeStyle: "short",
                    timeZone: "Australia/Sydney",
                  }).format(
                    new Date(tessituraDataStore?.performanceDetails.Date)
                  )
                : "") +
              (" in " +
                tessituraDataStore?.performanceDetails?.Facility.Description ||
                "ERROR")
            }
          />,
        ]}
      />
      <Modal
        title={modalTitle()}
        opened={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        styles={{
          inner: { position: "absolute" },
          title: { fontWeight: 700 },
          content: { borderRadius: "0.5rem" },
        }}
        centered
        size="auto"
        portalProps={{ target: ".seatmap" }}
        overlayProps={{ fixed: false }}
      >
        {modalContent()}
      </Modal>
    </MantineProvider>
  );
};

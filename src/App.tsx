import { useCallback, useEffect, useState } from "react";
import { css } from "@emotion/react";
import {
  BlindBoxContext,
  BlindBoxStatus,
  TActiveBlindBoxData,
  TBlindBoxData,
} from "./context/BlindBoxContext";
import { shuffle } from "lodash";
import { Card } from "./components/Card";
import { CenterCard } from "./components/CenterCard";
import { useQuery } from "@tanstack/react-query";
import { fetchJsonData } from "./services/api";

function App() {
  const [openingBox, setOpeningBox] = useState<TActiveBlindBoxData>();
  const [status, setStatus] = useState<BlindBoxStatus>("NONE");
  const [openedBoxes, setOpenBoxes] = useState<string[]>(
    (() => {
      const openedBoxes = localStorage.getItem("OPENED_BOXES");
      if (openedBoxes) {
        return JSON.parse(openedBoxes);
      } else {
        return [];
      }
    })()
  );

  const { data: boxes, isLoading } = useQuery<Array<TBlindBoxData>>({
    queryKey: ["BOX_DATA"],
    queryFn: async () => {
      const [boxFetching, giftFetching] = await Promise.allSettled([
        fetchJsonData<Array<Omit<TBlindBoxData, "secretBoxData">>>(
          "https://vdkleuqyjgpilnwyvual.supabase.co/storage/v1/object/public/images/box.json"
        ),
        fetchJsonData<Array<TBlindBoxData["secretBoxData"]>>(
          "https://vdkleuqyjgpilnwyvual.supabase.co/storage/v1/object/public/images/gift.json"
        ),
      ]);
      let boxData: Array<Omit<TBlindBoxData, "secretBoxData">> | undefined =
          undefined,
        giftData: Array<TBlindBoxData["secretBoxData"]> | undefined = undefined;
      if (boxFetching.status === "fulfilled") {
        boxData = boxFetching.value.data;
      }
      if (giftFetching.status === "fulfilled") {
        giftData = giftFetching.value.data;
      }
      if (boxData && giftData) {
        const boxNumber = Array(35)
          .fill(true)
          .map((_, index) => index);
        let secretBoxNumber: Array<TBlindBoxData["secretBoxData"]> = [];
        const secretBox = localStorage.getItem("SECRET_BOX");
        if (secretBox) {
          secretBoxNumber = JSON.parse(secretBox);
        } else {
          secretBoxNumber = shuffle(giftData);
          localStorage.setItem("SECRET_BOX", JSON.stringify(secretBoxNumber));
        }
        return boxNumber.map((index) => {
          return {
            ...boxData[index],
            secretBoxData: {
              name: secretBoxNumber[index].name,
              url: secretBoxNumber[index].url,
            },
          };
        });
      }
      return [];
    },
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const getDataById = useCallback(
    (id: string) => {
      return (boxes ?? []).find((el) => el.id === id);
    },
    [boxes]
  );

  const handleResetSecretBoxNumber = useCallback(() => {
    const sure = confirm("Are you sure?");
    if (sure) {
      localStorage.removeItem("SECRET_BOX");
      localStorage.removeItem("OPENED_BOXES");
      window.location.reload();
    }
  }, []);

  const handleBoxClosed = useCallback(
    (id: string) => {
      setOpenBoxes((prevOpenedBox) => [...prevOpenedBox, id]);
      setOpeningBox(undefined);
      setStatus("NONE");
    },
    [setStatus, setOpenBoxes, setOpeningBox]
  );

  const handleClick = useCallback(
    (ev: MouseEvent) => {
      if (status === "CLOSING" || status === "OPENING") {
        ev.preventDefault();
        return;
      }
      if (openingBox) {
        setStatus("CLOSING");
      } else {
        if (ev.target) {
          const target = ev.target as HTMLElement;
          if (target.getAttribute("data-target") === "box") {
            const id = target.getAttribute("data-target-id");
            if (id) {
              const { width, height, top, left } =
                target.getBoundingClientRect();
              setStatus("OPENING");
              setOpeningBox({ width, height, top, left, id });
            }
          }
        }
      }
    },
    [openingBox, status]
  );

  useEffect(() => {
    if (status === "OPENING") {
      setTimeout(() => {
        setStatus("NONE");
      }, 8000);
    }
  }, [status]);

  useEffect(() => {
    localStorage.setItem("OPENED_BOXES", JSON.stringify(openedBoxes));
  }, [openedBoxes]);

  useEffect(() => {
    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [handleClick, openingBox, status]);

  return (
    <BlindBoxContext.Provider
      value={{
        status,
        openedBoxes,
        openingBox,
        getDataById,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden flex flex-col">
        <div className="relative flex justify-center w-full text-center">
          <img
            src="/images/title.png"
            alt="Title"
            className="object-cover"
            width="560px"
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={handleResetSecretBoxNumber}
              className="w-[40px] h-[40px] bg-cover bg-center rounded-lg opacity-35 hover:opacity-100 shadow-sm hover:shadow-md active:shadow-xl active:relative active:-bottom-0.5 transition-all duration-300"
              css={css`
                background-image: url("/images/reload.png");
              `}
            ></button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-green-500 border-dotted rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="w-full h-full flex-1 grid grid-cols-7 grid-rows-5 gap-2 p-2 overflow-hidden cursor-pointer">
            {(boxes ?? []).map((box) => {
              return <Card key={box.id} boxId={box.id} />;
            })}
          </div>
        )}
        <CenterCard onClose={handleBoxClosed} />
      </div>
    </BlindBoxContext.Provider>
  );
}

export default App;

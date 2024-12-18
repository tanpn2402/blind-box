import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BlindBoxContext,
  BlindBoxStatus,
  TActiveBlindBoxData,
} from "./context/BlindBoxContext";
import data from "./data.json";
import { Card } from "./components/Card";
import { CenterCard } from "./components/CenterCard";

function App() {
  const [openingBox, setOpeningBox] = useState<TActiveBlindBoxData>();
  const [status, setStatus] = useState<BlindBoxStatus>("NONE");
  const [openedBoxes, setOpenBoxes] = useState<string[]>([]);
  const boxes = useMemo(() => {
    return Array(35)
      .fill(true)
      .map((_, index) => {
        return data[index];
      });
  }, []);

  const getDataById = useCallback((id: string) => {
    return data.find((el) => el.id === id);
  }, []);

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
      }, 1000);
    }
  }, [status]);

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
        <div className="flex justify-center w-full text-center">
          <img
            src="/images/title.png"
            alt="Title"
            className="object-cover"
            width="560px"
          />
        </div>
        <div className="w-full h-full flex-1 grid grid-cols-7 grid-rows-5 gap-2 p-2 overflow-hidden cursor-pointer">
          {boxes.map((box) => {
            return <Card key={box.id} boxId={box.id} />;
          })}
        </div>
        <CenterCard
          onClose={(id: string) => {
            setOpenBoxes((prevOpenedBox) => [...prevOpenedBox, id]);
            setOpeningBox(undefined);
            setStatus("NONE");
          }}
        />
      </div>
    </BlindBoxContext.Provider>
  );
}

export default App;

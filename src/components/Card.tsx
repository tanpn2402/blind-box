import React, { useMemo } from "react";
import { useBlindBox } from "../context/hooks";

const Card: React.FC<{
  boxId: string;
}> = ({ boxId }) => {
  const { getDataById, openedBoxes } = useBlindBox();
  const data = useMemo(() => getDataById(boxId), [getDataById, boxId]);

  if (!data) {
    return <React.Fragment />;
  }
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      style={{
        filter: openedBoxes.includes(boxId)
          ? "brightness(0.4) blur(1px)"
          : "unset",
        cursor: openedBoxes.includes(boxId) ? "none" : "pointer",
        userSelect: "none",
        pointerEvents: openedBoxes.includes(boxId) ? "none" : "all",
      }}
    >
      <img
        data-target="box"
        data-target-id={boxId}
        width="100%"
        height="100%"
        src={"/images/" + data.url}
        alt="Original"
        className="w-full h-full"
        style={{
          objectFit: "scale-down",
          backgroundColor: data.bg,
        }}
      />
    </div>
  );
};

export { Card };

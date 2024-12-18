import React, { useEffect, useMemo, useRef } from "react";
import { useBlindBox } from "../context/hooks";

const CenterCard: React.FC<{ onClose: (id: string) => void }> = ({
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { openingBox, status, getDataById } = useBlindBox();
  const data = useMemo(
    () => (openingBox?.id ? getDataById(openingBox.id) : undefined),
    [getDataById, openingBox]
  );

  useEffect(() => {
    if (ref.current && openingBox) {
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.top = "50%";
          ref.current.style.left = "50%";
          ref.current.style.transform = "translate(-50%, -50%)";
          ref.current.style.width = "800px";
          ref.current.style.height = "800px";
          ref.current.style.boxShadow = `#2d2d2d 0px 0px 30px 4px`;
        }
      }, 100);
    }
  }, [openingBox]);

  useEffect(() => {
    if (status === "CLOSING" && openingBox) {
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.top = openingBox.top + "px";
          ref.current.style.left = openingBox.left + "px";
          ref.current.style.transform = "unset";
          ref.current.style.width = openingBox.width + "px";
          ref.current.style.height = openingBox.height + "px";
          ref.current.style.boxShadow = `unset`;
        }
      }, 100);

      setTimeout(() => {
        onClose(openingBox.id);
      }, 1200);
    }
  }, [onClose, status, openingBox]);

  if (!openingBox || !data) {
    return <React.Fragment />;
  }

  return (
    <div
      ref={ref}
      className="bg-white rounded-lg shadow-lg overflow-hidden absolute"
      style={{
        width: openingBox.width,
        height: openingBox.height,
        top: openingBox.top,
        left: openingBox.left,
        transition: "all 1s ease",
      }}
    >
      <img
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

export { CenterCard };

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useBlindBox } from "../context/hooks";
import { getImageSvgSmallUrl } from "../utils/getImageSvgUrl";

const Card: React.FC<{
  boxId: string;
}> = ({ boxId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const { getDataById, openedBoxes } = useBlindBox();
  const data = useMemo(() => getDataById(boxId), [getDataById, boxId]);
  const isOpened = useMemo(
    () => openedBoxes.includes(boxId),
    [openedBoxes, boxId]
  );

  useGSAP(
    () => {
      if (isOpened) {
        gsap.to("#gaa", {
          attr: {
            values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -15",
          },
          duration: 1,
          ease: "none",
          repeat: 1,
          yoyo: true,
          delay: 0,
        });
      }
    },
    { scope: svgRef, dependencies: [isOpened] }
  );

  useEffect(() => {
    if (data && containerRef.current) {
      const boundingClientRect = containerRef.current.getBoundingClientRect();
      setContainerSize({
        width: boundingClientRect.width,
        height: boundingClientRect.height,
      });
    }
  }, [setContainerSize, data]);

  if (!data) {
    return <React.Fragment />;
  }
  return (
    <div
      ref={containerRef}
      className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      style={{
        cursor: isOpened ? "none" : "pointer",
        userSelect: "none",
        pointerEvents: isOpened ? "none" : "all",
        backgroundColor: data.bg,
      }}
    >
      {isOpened ? (
        <>
          <div className="w-full h-full flex items-center justify-center text-2xl">
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${containerSize.width - 10} ${
                containerSize.height - 10
              }`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id={`distort_${boxId}`}>
                  <feFlood
                    x="5%"
                    y="5%"
                    width="90%"
                    height="90%"
                    floodColor="green"
                    result="shark0"
                    id="shark0"
                  />

                  <feTurbulence
                    type="turbulence"
                    baseFrequency="0.0015"
                    numOctaves="5"
                    seed="13"
                    result="noir1"
                    id="noir1"
                  />

                  <feColorMatrix
                    in="noir2"
                    id="moveNoir"
                    type="hueRotate"
                    result="moveNoir"
                    values="0"
                  />

                  <feDisplacementMap
                    in="shark0"
                    in2="moveNoir"
                    scale="75"
                    result="shark1"
                    id="shark1"
                  />

                  <feTurbulence
                    type="turbulence"
                    baseFrequency="0.01"
                    numOctaves="2"
                    result="noir2"
                    id="noir2"
                  />
                  <feDisplacementMap
                    in2="moveNoir"
                    in="shark1"
                    scale="-30"
                    xChannelSelector="B"
                    yChannelSelector="G"
                    result="shark2"
                    id="shark2"
                  />

                  <feGaussianBlur
                    in="shark2"
                    result="shark2b"
                    stdDeviation="0.5"
                  />

                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.05"
                    numOctaves="2"
                    result="noir3"
                    id="noir3"
                  />
                  <feDisplacementMap
                    in2="noir3"
                    in="shark2b"
                    scale="10"
                    result="shark3"
                    id="shark3"
                  />

                  <feComposite
                    in="SourceGraphic"
                    operator="in"
                    result="image"
                  />

                  <feColorMatrix
                    type="matrix"
                    in="noir1"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 0"
                    result="gaa"
                    id="gaa"
                  />

                  <feComposite
                    in="image"
                    in2="gaa"
                    operator="in"
                    result="final"
                  />

                  <feDisplacementMap in2="gaa" in="final" scale="20" />
                </filter>
              </defs>
              <image
                x="0"
                y="0"
                filter={`url(#distort_${boxId})`}
                width="100%"
                height="100%"
                xlinkHref={getImageSvgSmallUrl(
                  data.secretBoxData.number,
                  data.color,
                  containerSize.width,
                  containerSize.height
                )}
                style={{
                  objectFit: "scale-down",
                }}
              />
            </svg>
          </div>
        </>
      ) : (
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
      )}
    </div>
  );
};

export { Card };

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { css } from "@emotion/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useBlindBox } from "../context/hooks";

const Card: React.FC<{
  boxId: string;
}> = ({ boxId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const { getDataById, openedBoxes, status } = useBlindBox();
  const data = useMemo(() => getDataById(boxId), [getDataById, boxId]);
  const isOpened = useMemo(
    () => openedBoxes.includes(boxId),
    [openedBoxes, boxId]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * -8;

      setRotation({ x: rotateX, y: rotateY });
    },
    [setRotation]
  );

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 });
  }, [setRotation]);

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
      onMouseMove={status === "NONE" ? handleMouseMove : undefined}
      onMouseLeave={status === "NONE" ? handleMouseLeave : undefined}
      className="rounded-lg shadow-2xl overflow-hidden"
      style={{
        cursor: isOpened ? "none" : "pointer",
        userSelect: "none",
        pointerEvents: isOpened ? "none" : "all",
        backgroundColor: data.bg,
      }}
      data-lg-hover
      css={css`
        transform-style: preserve-3d;
        perspective: 1000px;
        transition: all 0.3s ease;

        &:hover {
          transform: ${status === "NONE"
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.1)`
            : "none"};
          z-index: 1;
          box-shadow: ${status === "NONE"
            ? "#2d2d2d 0px 0px 30px 4px;"
            : "none"};
        }
      `}
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
                    x="10%"
                    y="5%"
                    width="80%"
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
              <rect
                width="100%"
                height="100%"
                fill={"#FFF"}
                filter={`url(#distort_${boxId})`}
              />
              <image
                x="10%"
                y="10%"
                width="80%"
                height="80%"
                filter={`url(#distort_${boxId})`}
                xlinkHref={data.secretBoxData.url}
                style={{
                  objectFit: "scale-down",
                  backgroundColor: data.bg,
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

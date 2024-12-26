import React, { useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useBlindBox } from "../context/hooks";

const CenterCard: React.FC<{ onClose: (id: string) => void }> = ({
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [state, setState] = useState<"READY" | "REVEAL">("READY");
  const { openingBox, status, getDataById } = useBlindBox();

  const boxData = useMemo(() => {
    if (openingBox) {
      const scaleWidth = (window.innerWidth - 100) / openingBox.width;
      const scaleHeight = (window.innerHeight - 100) / openingBox.height;
      const scaleFactor = Math.min(scaleWidth, scaleHeight);
      return {
        ...openingBox,
        width: openingBox.width * scaleFactor,
        height: openingBox.height * scaleFactor,
      };
    }
    return openingBox;
  }, [openingBox]);

  const data = useMemo(
    () => (openingBox?.id ? getDataById(openingBox.id) : undefined),
    [getDataById, openingBox]
  );

  const imageTag = useMemo(() => {
    if (state === "READY") {
      return (
        <image
          x="0"
          y="0"
          filter="url(#distort)"
          width="100%"
          height="100%"
          xlinkHref={"/images/" + data?.url}
          style={{
            objectFit: "scale-down",
          }}
        />
      );
    }
    if (state === "REVEAL" && data) {
      return (
        <>
          <rect
            width="100%"
            height="100%"
            fill={"#FFF"}
            filter={`url(#distort)`}
          />
          <image
            x="10%"
            y="10%"
            width="80%"
            height="80%"
            filter="url(#distort)"
            xlinkHref={data.secretBoxData.url}
            style={{
              objectFit: "scale-down",
              backgroundColor: data.bg,
            }}
          />
        </>
      );
    } else {
      return undefined;
    }
  }, [data, state]);

  useEffect(() => {
    if (ref.current && boxData) {
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.top = "50%";
          ref.current.style.left = "50%";
          ref.current.style.transform = "translate(-50%, -50%)";
          ref.current.style.width = boxData.width + "px";
          ref.current.style.height = boxData.height + "px";
          ref.current.style.boxShadow = `#2d2d2d 0px 0px 30px 4px`;
        }
      }, 100);
    }
  }, [boxData]);

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

  useGSAP(
    () => {
      if (openingBox) {
        setState("READY");
        gsap.to("#moveNoise", {
          attr: {
            values: 360,
          },
          duration: 6,
          ease: "none",
          repeat: 1,
          delay: 2,
        });

        gsap.to("#goo", {
          attr: {
            values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -15",
          },
          duration: 2,
          ease: "none",
          repeat: 1,
          yoyo: true,
          delay: 2,
        });

        setTimeout(() => {
          setState("REVEAL");
        }, 3500);
      }
    },
    { scope: svgRef, dependencies: [openingBox] }
  );

  if (!openingBox || !data || !boxData) {
    return <React.Fragment />;
  }

  return (
    <div
      ref={ref}
      key={openingBox.id}
      className="z-50 bg-white rounded-lg shadow-lg overflow-hidden absolute"
      style={{
        width: openingBox.width,
        height: openingBox.height,
        top: openingBox.top,
        left: openingBox.left,
        transition: "all 1s ease",
        backgroundColor: data.bg,
        transformStyle: "preserve-3d",
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${boxData.width - 20} ${boxData.height - 20}`}
        xmlns="http://www.w3.org/2000/svg"
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          max-width: 90vw;
          transform: translate3d(-50%, -50%, 0) rotate(0deg);
          will-change: transform;
        `}
      >
        <defs>
          <filter id="distort">
            <feFlood
              x="5%"
              y="5%"
              width="90%"
              height="90%"
              floodColor="green"
              result="shape0"
              id="shape0"
            />

            <feTurbulence
              type="turbulence"
              baseFrequency="0.0015"
              numOctaves="5"
              seed="13"
              result="noise1"
              id="noise1"
            />

            <feColorMatrix
              in="noise2"
              id="moveNoise"
              type="hueRotate"
              result="moveNoise"
              values="0"
            />

            <feDisplacementMap
              in="shape0"
              in2="moveNoise"
              scale="75"
              result="shape1"
              id="shape1"
            />

            <feTurbulence
              type="turbulence"
              baseFrequency="0.01"
              numOctaves="2"
              result="noise2"
              id="noise2"
            />
            <feDisplacementMap
              in2="moveNoise"
              in="shape1"
              scale="-30"
              xChannelSelector="B"
              yChannelSelector="G"
              result="shape2"
              id="shape2"
            />

            <feGaussianBlur in="shape2" result="shape2b" stdDeviation="0.5" />

            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="2"
              result="noise3"
              id="noise3"
            />
            <feDisplacementMap
              in2="noise3"
              in="shape2b"
              scale="10"
              result="shape3"
              id="shape3"
            />

            <feComposite in="SourceGraphic" operator="in" result="image" />

            <feColorMatrix
              type="matrix"
              in="noise1"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 0"
              result="goo"
              id="goo"
            />

            <feComposite in="image" in2="goo" operator="in" result="final" />

            <feDisplacementMap in2="goo" in="final" scale="20" />
          </filter>
        </defs>
        {imageTag}
      </svg>
    </div>
  );
};

export { CenterCard };

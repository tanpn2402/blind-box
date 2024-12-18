import { useContext } from "react";
import { BlindBoxContext } from "./BlindBoxContext";

const useBlindBox = () => {
  return useContext(BlindBoxContext)!;
};

export { useBlindBox };

import { useEffect, useCallback, useRef, useState } from "react";
import {
  getCurrentTimestamp,
  saveCurrentTimestamp,
  getLastTimestamp,
  getTimeDifferenceInSeconds,
} from "@/lib/timestamp";

export const useTimestampTracker = () => {
  const intervalRef = useRef(null);
  const UPDATE_THRESHOLD = 3 * 60 * 60; // 3 jam
  const [timestamp, setTimestamp] = useState(() => getLastTimestamp());

  const checkAndUpdateTimestamp = useCallback(() => {
    const lastTimestamp = getLastTimestamp();
    const currentTimestamp = getCurrentTimestamp();

    if (!lastTimestamp) {
      const newTimestamp = saveCurrentTimestamp();
      setTimestamp(newTimestamp);
      return;
    }

    const timeDifference = getTimeDifferenceInSeconds(lastTimestamp, currentTimestamp);

    if (timeDifference >= UPDATE_THRESHOLD) {
      const newTimestamp = saveCurrentTimestamp();
      setTimestamp(newTimestamp);
    } else {
      setTimestamp(lastTimestamp);
    }
  }, [UPDATE_THRESHOLD]);

  useEffect(() => {
    checkAndUpdateTimestamp();

    intervalRef.current = setInterval(
      () => {
        checkAndUpdateTimestamp();
      },
      30 * 60 * 1000
    ); // 30 menit

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkAndUpdateTimestamp]);

  return { timestamp };
};

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import magicCube from "~/magic-cube/services/magic-cube";
import type { Move } from "../types/types";
import { useCube } from "./magic-cube.provider";

type StandardChallengeContextType = {
  isStarted: boolean;
  startChallenge: () => void;
  count: number;
  timer: number;
  tps: number;
  prestartTimeLeft: number;
  isPrestart: boolean;
};

const defaultValue: StandardChallengeContextType = {
  isStarted: false,
  startChallenge: () => {},
  count: 0,
  timer: 0,
  tps: 0,
  prestartTimeLeft: 0,
  isPrestart: false,
};

const StandardChallengeContext =
  createContext<StandardChallengeContextType>(defaultValue);

export const useStandardChallenge = () =>
  useContext<StandardChallengeContextType>(StandardChallengeContext);

export const StandardChallengeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isCompleted } = useCube();
  const [isStarted, setIsStarted] = useState(false);
  const [prestartTimeLeft, setPrestartTimeLeft] = useState(15);
  const [isPrestart, setIsPrestart] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  // Observe magicCube.queue changes using a state and effect
  const [queue, setQueue] = useState<Move[]>([]);

  // Assume magicCube exposes an event emitter or subscribe method
  const handleQueueChange = useCallback(
    (newMove: Move) => {
      setQueue((prev) => [...prev, newMove]);
    },
    [setQueue]
  );

  const startChallenge = () => {
    setPrestartTimeLeft(15);
    setIsPrestart(true);
    setIsStarted(false);
    setStartTime(null);
    setEndTime(null);
    setQueue([]);
    magicCube.subscribeQueue(handleQueueChange); // Subscribe to queue changes can early start, not need wait for preset
  };

  const start = () => {
    setIsPrestart(false);
    setIsStarted(true);
    setStartTime(Date.now());
    setEndTime(Date.now());
  };

  const end = () => {
    setIsStarted(false);
    magicCube.unsubscribeQueue(handleQueueChange);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((isPrestart && prestartTimeLeft === 0) || queue.length > 0) {
      start();
      return () => clearTimeout(timer);
    }

    if (isPrestart && prestartTimeLeft > 0) {
      timer = setTimeout(() => setPrestartTimeLeft(prestartTimeLeft - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [isPrestart, prestartTimeLeft]);

  // Start time count
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted) {
      timer = setTimeout(() => {
        if (isCompleted) {
          end();
          return () => clearTimeout(timer);
        }

        setEndTime(Date.now());
      }, 10); // update every 10ms
    }
    return () => clearTimeout(timer);
  }, [isStarted, endTime]);

  const timer = startTime && endTime ? +(endTime - startTime) / 1000 : 0;
  const tps =
    startTime && endTime && queue.length > 0 ? queue.length / timer : 0;

  return (
    <StandardChallengeContext.Provider
      value={{
        isStarted,
        timer,
        startChallenge,
        count: queue.length,
        tps,
        prestartTimeLeft,
        isPrestart,
      }}
    >
      {children}
    </StandardChallengeContext.Provider>
  );
};

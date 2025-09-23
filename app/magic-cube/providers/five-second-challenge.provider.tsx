import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import magicCube from "~/magic-cube/services/magic-cube";
import type { Move } from "../types/types";

type FiveSecondChallengeContextType = {
  isStarted: boolean;
  timeLeft: number;
  prestartTimeLeft: number;
  startChallenge: () => void;
  isPrestart: boolean;
  count: number;
  tps: number;
};

const defaultContext: FiveSecondChallengeContextType = {
  isStarted: false,
  timeLeft: 5,
  prestartTimeLeft: 0,
  startChallenge: () => {},
  isPrestart: false,
  count: 0,
  tps: 0,
};

const FiveSecondChallengeContext =
  createContext<FiveSecondChallengeContextType>(defaultContext);

export const useFiveSecondChallenge = () =>
  useContext<FiveSecondChallengeContextType>(FiveSecondChallengeContext);

export const FiveSecondChallengeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // seconds, float
  const [prestartTimeLeft, setPrestartTimeLeft] = useState(0);
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
    setTimeLeft(5);
    setPrestartTimeLeft(3);
    setIsPrestart(true);
    setIsStarted(false);
    setStartTime(null);
    setEndTime(null);
    setQueue([]);
  };

  const start = () => {
    magicCube.subscribeQueue(handleQueueChange);
    setIsPrestart(false);
    setIsStarted(true);
    setTimeLeft(5);
    setStartTime(Date.now());
    setEndTime(null);
  };

  const end = () => {
    setIsStarted(false);
    setEndTime(Date.now());
    magicCube.unsubscribeQueue(handleQueueChange);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPrestart && prestartTimeLeft > 0) {
      timer = setTimeout(() => setPrestartTimeLeft(prestartTimeLeft - 1), 1000);
    } else if (isPrestart && prestartTimeLeft === 0) {
      start();
    }
    return () => clearTimeout(timer);
  }, [isPrestart, prestartTimeLeft]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => {
          const next = +(prev - 0.01).toFixed(2);
          if (next <= 0) {
            end();
            return 0;
          }
          return next;
        });
      }, 10); // update every 10ms
    }
    return () => clearTimeout(timer);
  }, [isStarted, timeLeft]);

  const tps =
    startTime && endTime && queue.length > 0
      ? queue.length / ((endTime - startTime) / 1000)
      : 0;

  return (
    <FiveSecondChallengeContext.Provider
      value={{
        isStarted,
        timeLeft,
        prestartTimeLeft,
        startChallenge,
        isPrestart,
        count: queue.length,
        tps,
      }}
    >
      {children}
    </FiveSecondChallengeContext.Provider>
  );
};

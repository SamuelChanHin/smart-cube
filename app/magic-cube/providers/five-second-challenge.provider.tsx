import { createContext, useContext, useEffect, useState } from "react";
import magicCube from "~/magic-cube/services/magic-cube";

const FiveSecondChallengeContext = createContext<
  FiveSecondChallengeContextType | undefined
>(undefined);

type FiveSecondChallengeContextType = {
  isActive: boolean;
  timeLeft: number;
  prestartTimeLeft: number;
  startChallenge: () => void;
  isPrestart: boolean;
  count: number;
  tps: number;
};

export const useFiveSecondChallenge = () => {
  const context = useContext(FiveSecondChallengeContext);
  if (!context) {
    throw new Error(
      "useFiveSecondChallenge must be used within a FiveSecondChallengeProvider"
    );
  }
  return context;
};

export const FiveSecondChallengeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // seconds, float
  const [prestartTimeLeft, setPrestartTimeLeft] = useState(0);
  const [isPrestart, setIsPrestart] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPrestart && prestartTimeLeft > 0) {
      timer = setTimeout(() => setPrestartTimeLeft(prestartTimeLeft - 1), 1000);
    } else if (isPrestart && prestartTimeLeft === 0) {
      setIsPrestart(false);
      setIsActive(true);
      setTimeLeft(5);
      setStartTime(Date.now());
      setEndTime(null);
      magicCube.start();
    }
    return () => clearTimeout(timer);
  }, [isPrestart, prestartTimeLeft]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => {
          const next = +(prev - 0.01).toFixed(2);
          if (next <= 0) {
            setIsActive(false);
            setEndTime(Date.now());
            magicCube.stopCount();
            return 0;
          }
          return next;
        });
      }, 10); // update every 10ms
    }
    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  const startChallenge = () => {
    setIsPrestart(true);
    setPrestartTimeLeft(3);
    setIsActive(false);
    setTimeLeft(5);
    setStartTime(null);
    setEndTime(null);
    magicCube.resetCount();
  };

  const tps =
    startTime && endTime && magicCube.getCounter() > 0
      ? magicCube.getCounter() / ((endTime - startTime) / 1000)
      : 0;

  return (
    <FiveSecondChallengeContext.Provider
      value={{
        isActive,
        timeLeft,
        prestartTimeLeft,
        startChallenge,
        isPrestart,
        count: magicCube.getCounter(),
        tps,
      }}
    >
      {children}
    </FiveSecondChallengeContext.Provider>
  );
};

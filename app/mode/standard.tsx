import { createContext, useContext, useEffect, useState } from "react";
import magicCube from "~/services/magic-cube";

const StandardChallengeContext = createContext<
  StandardChallengeContextType | undefined
>(undefined);

type StandardChallengeContextType = {
  isActive: boolean;
  startChallenge: () => void;
  count: number;
  timer: number;
  tps: number;
  prestartTimeLeft: number;
  isPrestart: boolean;
};

export const useStandardChallenge = () => {
  const context = useContext(StandardChallengeContext);
  if (!context) {
    throw new Error(
      "useStandardChallenge must be used within a StandardChallengeProvider"
    );
  }
  return context;
};

export const StandardChallengeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [prestartTimeLeft, setPrestartTimeLeft] = useState(3);
  const [isPrestart, setIsPrestart] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(0);
  const [endTime, setEndTime] = useState<number | null>(0);

  // Ready time countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPrestart && prestartTimeLeft > 0) {
      // Ready
      timer = setTimeout(() => setPrestartTimeLeft(prestartTimeLeft - 1), 1000);
    } else if (isPrestart && prestartTimeLeft === 0) {
      // Go
      setIsPrestart(false);
      setIsActive(true);
      setStartTime(Date.now());
      setEndTime(Date.now());
      magicCube.start();
    }
    return () => clearTimeout(timer);
  }, [isPrestart, prestartTimeLeft]);

  // Start time count
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setTimeout(() => {
        if (magicCube.isComplete()) {
          endChallenge();
        }

        setEndTime(Date.now());
      }, 10); // update every 10ms
    }
    return () => clearTimeout(timer);
  }, [isActive, endTime]);

  const endChallenge = () => {
    setIsActive(false);
    magicCube.stopCount();
  };

  const startChallenge = () => {
    setIsPrestart(true);
    setPrestartTimeLeft(3);
    setIsActive(false);
    setStartTime(0);
    setEndTime(0);
    magicCube.resetCount();
  };

  const timer = startTime && endTime ? +(endTime - startTime) / 1000 : 0;
  const tps =
    startTime && endTime && magicCube.getCounter() > 0
      ? magicCube.getCounter() / timer
      : 0;

  return (
    <StandardChallengeContext.Provider
      value={{
        isActive,
        timer,
        startChallenge,
        count: magicCube.getCounter(),
        tps,
        prestartTimeLeft,
        isPrestart,
      }}
    >
      {children}
    </StandardChallengeContext.Provider>
  );
};

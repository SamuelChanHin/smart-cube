import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  connectGanCube,
  type GanCubeConnection,
  type MacAddressProvider,
} from "gan-web-bluetooth";
import magicCube from "~/magic-cube/services/magic-cube";
import type { Move } from "../types/types";
import type { TopFaceColor } from "../constants/color";

const INITIAL_FACELETS =
  "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";

const customMacAddressProvider: MacAddressProvider = async (
  device,
  isFallbackCall
): Promise<string | null> => {
  const mac = localStorage.getItem("gan-cube-mac");
  if (mac) {
    return mac;
  }

  if (isFallbackCall) {
    return prompt(
      "Unable do determine cube MAC address!\nPlease enter MAC address manually:"
    );
  } else {
    return typeof device.watchAdvertisements == "function"
      ? null
      : prompt(
          "Seems like your browser does not support Web Bluetooth watchAdvertisements() API. Enable following flag in Chrome:\n\nchrome://flags/#enable-experimental-web-platform-features\n\nor enter cube MAC address manually:"
        );
  }
};

type CubeContextType = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  resetCube: () => void;
  connecting: boolean;
  connected: boolean;
  cubeName?: string;
  quaternion: { x: number; y: number; z: number; w: number } | null;
  isCompleted: boolean;
  topFaceColor: TopFaceColor;
  setTopFaceColor: React.Dispatch<React.SetStateAction<TopFaceColor>>;
};

const DefaultContext: CubeContextType = {
  connect: async () => {},
  disconnect: async () => {},
  resetCube: () => {},
  connecting: false,
  connected: false,
  cubeName: undefined,
  quaternion: null,
  isCompleted: false,
  topFaceColor: "white",
  setTopFaceColor: () => {},
};

const CubeContext = createContext<CubeContextType>(DefaultContext);

export const CubeProvider = ({ children }: { children: ReactNode }) => {
  const [conn, setConn] = useState<GanCubeConnection | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [cubeName, setCubeName] = useState<string | undefined>(undefined);
  const [quaternion, setQuaternion] = useState<{
    x: number;
    y: number;
    z: number;
    w: number;
  } | null>(null);

  const [topFaceColor, setTopFaceColor] = useState<TopFaceColor>("white");

  const connect = async () => {
    if (connecting) return;

    setConnecting(true);
    try {
      const _conn = await connectGanCube(customMacAddressProvider);
      setConn(_conn);
    } catch (e) {
      console.error("Connection failed", e);
      alert("Connection failed: " + (e as Error).message);
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!conn) return;

    await conn.disconnect();
    setConn(null);
    setConnected(false);
    setConnecting(false);
    setQuaternion(null);
  };

  const handleConnectSuccessEvent = ({
    hardwareName,
    deviceMAC,
  }: {
    hardwareName: string;
    deviceMAC: string;
  }) => {
    localStorage.setItem("gan-cube-mac", deviceMAC);
    setCubeName(hardwareName);
    setConnecting(false);
    setConnected(true);
  };

  const handleMoveEvent = (move: Move) => {
    magicCube.pushQueue(move);
  };

  const resetCube = () => {
    if (!conn) return;
    conn.sendCubeCommand({ type: "REQUEST_RESET" });
  };

  const handleFaceletsEvent = (facelets: string) => {
    if (facelets === INITIAL_FACELETS) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  const handleGyroEvent = (quaternion: {
    x: number;
    y: number;
    z: number;
    w: number;
  }) => {
    setQuaternion(quaternion);
  };

  const initEvent = async () => {
    if (!conn) return;

    conn.events$.subscribe((event) => {
      if (event.type === "HARDWARE") {
        handleConnectSuccessEvent({
          hardwareName: event.hardwareName!,
          deviceMAC: conn.deviceMAC,
        });
      } else if (event.type == "MOVE") {
        handleMoveEvent(event.move as Move);
      } else if (event.type === "FACELETS") {
        handleFaceletsEvent(event.facelets);
      } else if (event.type === "GYRO") {
        handleGyroEvent(event.quaternion);
      }
    });

    await conn.sendCubeCommand({ type: "REQUEST_HARDWARE" });
    await conn.sendCubeCommand({ type: "REQUEST_FACELETS" });
  };

  useEffect(() => {
    initEvent();
  }, [conn]);

  return (
    <CubeContext.Provider
      value={{
        connect,
        disconnect,
        resetCube,
        cubeName,
        connecting,
        connected,
        quaternion,
        isCompleted,
        topFaceColor,
        setTopFaceColor,
      }}
    >
      {children}
    </CubeContext.Provider>
  );
};

export const useCube = () => useContext<CubeContextType>(CubeContext);

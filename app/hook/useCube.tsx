import { connectGanCube, type MacAddressProvider } from "gan-web-bluetooth";
import { useEffect, useState } from "react";
import type { Move } from "~/cube/types";
import magicCube from "~/services/magic-cube";

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

function useCube() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [cubeName, setCubeName] = useState<string | undefined>(undefined);
  const [quaternion, setQuaternion] = useState<{
    x: number;
    y: number;
    z: number;
    w: number;
  } | null>(null);

  const connect = async () => {
    console.log("Connecting to GAN Cube...");
    if (loading) return;

    setLoading(true);
    try {
      const conn = await connectGanCube(customMacAddressProvider);

      conn.events$.subscribe((event) => {
        if (event.type === "HARDWARE") {
          console.log("Connected to GAN Cube", event);
          localStorage.setItem("gan-cube-mac", conn.deviceMAC);

          setCubeName(event.hardwareName);
          setLoading(false);
          setConnected(true);
        } else if (event.type == "MOVE") {
          magicCube.pushQueue(event.move as Move);
        } else if (event.type === "FACELETS") {
          if (
            event.facelets ===
            "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
          ) {
            magicCube.updateCompleteness(true);
          } else {
            magicCube.updateCompleteness(false);
          }
        } else if (event.type === "GYRO") {
          // Handle gyroscope data if needed
          console.log("Gyro data:", event);
          setQuaternion(event.quaternion);
        }
      });

      await conn.sendCubeCommand({ type: "REQUEST_HARDWARE" });
      await conn.sendCubeCommand({ type: "REQUEST_FACELETS" });
    } catch (e) {
      console.error("Connection failed", e);
      alert("Connection failed: " + (e as Error).message);
      setLoading(false);
    }
  };

  return {
    connect,
    cubeName,
    loading,
    connected,
    quaternion,
  };
}

export default useCube;

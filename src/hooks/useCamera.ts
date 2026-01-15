// --- useCamera.ts -------------------------------------------
import { useEffect, useState, useRef, useCallback } from "react";

const useCamera = (videoRef: { current: HTMLVideoElement | null }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );
  const [stream, setStream] = useState<MediaStream | null>(null);


  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;

    setError(null);

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(newStream);
      videoRef.current.srcObject = newStream;
      await videoRef.current.play();
      setIsCameraActive(true);
    } catch {
      setError("Camera access denied or unavailable");
      setIsCameraActive(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, [stream]);

  const toggleCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
    setTimeout(startCamera, 250);
  };

  useEffect(() => {
    return () => stopCamera(); // on component unmount
  }, []);

  return { startCamera, stopCamera, toggleCamera, error, stream, isCameraActive };
};

export default useCamera;

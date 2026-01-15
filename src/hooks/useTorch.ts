import { useState, useCallback } from "react";

export default function useTorch(stream: MediaStream | null) {
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  const getTrack = () => {
    if (!stream) return null;
    return stream.getVideoTracks()[0] || null;
  };

  const checkTorchSupport = useCallback(async () => {
    const track = getTrack();
    if (!track) {
      setIsSupported(false);
      return false;
    }

    try {
      const imageCapture = new ImageCapture(track);
      const capabilities = await imageCapture.getPhotoCapabilities();

      if ("torch" in capabilities && capabilities.torch === true) {
        setIsSupported(true);
        return true;
      } else {
        setIsSupported(false);
        return false;
      }
    } catch (err) {
      console.warn("Torch capability check failed", err);
      setIsSupported(false);
      return false;
    }
  }, [stream]);

  const enableTorch = useCallback(async () => {
    const track = getTrack();
    if (!track) return;

    try {
      await track.applyConstraints({ advanced: [{ torch: true }] });
      setIsTorchOn(true);
    } catch (err) {
      console.error("Failed to enable torch", err);
    }
  }, [stream]);

  const disableTorch = useCallback(async () => {
    const track = getTrack();
    if (!track) return;

    try {
      await track.applyConstraints({ advanced: [{ torch: false }] });
      setIsTorchOn(false);
    } catch (err) {
      console.error("Failed to disable torch", err);
    }
  }, [stream]);

  const toggleTorch = useCallback(async () => {
    if (!isSupported) return;
    if (isTorchOn) await disableTorch();
    else await enableTorch();
  }, [isTorchOn, isSupported]);

  return {
    isTorchOn,
    isSupported,
    checkTorchSupport,
    enableTorch,
    disableTorch,
    toggleTorch,
  };
}

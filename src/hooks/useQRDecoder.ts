// --- useQRDecoder.ts ------------------------------------------
import { useEffect, useRef, useState } from "react";
import jsQR, { QRCode } from "jsqr";

const SCAN_INTERVAL = 120; // throttle ms

const useQRDecoder = (videoRef: { current: HTMLVideoElement | null }) => {
  const [decoded, setDecoded] = useState<string | null>(null);

  const animationRef = useRef<number>();
  const lastScanRef = useRef(0);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scan = (timestamp: number) => {
      const video = videoRef.current;

      if (!video || !ctx) {
        animationRef.current = requestAnimationFrame(scan);
        return;
      }

      // Throttle scans
      if (timestamp - lastScanRef.current < SCAN_INTERVAL) {
        animationRef.current = requestAnimationFrame(scan);
        return;
      }
      lastScanRef.current = timestamp;

      if (video.readyState >= video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const qr = jsQR(img.data, canvas.width, canvas.height);

        if (qr) {
          drawBox(ctx, qr);
          setDecoded(qr.data);
        }
      }

      animationRef.current = requestAnimationFrame(scan);
    };

    animationRef.current = requestAnimationFrame(scan);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const drawBox = (ctx: CanvasRenderingContext2D, code: QRCode) => {
    if (!code.location) return;
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
    ctx.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
    ctx.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
    ctx.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
    ctx.closePath();
    ctx.stroke();
  };

  return decoded;
};

export default useQRDecoder;

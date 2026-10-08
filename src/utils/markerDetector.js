import jsQR from "jsqr";

export function createQrDetector(video, onDetected, onLost) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let raf = 0;
  let lastSeen = 0;
  let active = true;
  const LOST_AFTER = 450;

  const tick = () => {
    if (!active) return;
    if (video.readyState >= 2 && video.videoWidth > 0) {
      const targetWidth = Math.min(720, video.videoWidth);
      const scale = targetWidth / video.videoWidth;
      canvas.width = targetWidth;
      canvas.height = Math.round(video.videoHeight * scale);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(image.data, image.width, image.height, {
        inversionAttempts: "attemptBoth",
      });
      if (code) {
        lastSeen = performance.now();
        onDetected(code.data, code.location);
      } else if (lastSeen && performance.now() - lastSeen > LOST_AFTER) {
        onLost();
      }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    active = false;
    cancelAnimationFrame(raf);
  };
}

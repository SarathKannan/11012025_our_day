// // Old Code:
// import {
//   Camera,
//   Heart,
//   Volume2,
//   VolumeX,
//   Play,
//   RotateCcw,
//   X,
// } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import { createQrDetector } from "../utils/markerDetector";

// export default function CameraView({ memory, onExit }) {
//   const videoRef = useRef(null);
//   const memoryVideoRef = useRef(null);
//   const streamRef = useRef(null);
//   const detectorStopRef = useRef(null);
//   const [cameraState, setCameraState] = useState("requesting");
//   const [found, setFound] = useState(false);
//   const [muted, setMuted] = useState(true);
//   const [error, setError] = useState("");
//   const [fallback, setFallback] = useState(false);

//   const stopCamera = () => {
//     detectorStopRef.current?.();
//     detectorStopRef.current = null;
//     streamRef.current?.getTracks().forEach((t) => t.stop());
//     streamRef.current = null;
//   };

//   useEffect(() => {
//     let mounted = true;
//     async function start() {
//       try {
//         if (!navigator.mediaDevices?.getUserMedia)
//           throw new Error("unsupported");
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             facingMode: { ideal: "environment" },
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//           },
//           audio: false,
//         });
//         if (!mounted) {
//           stream.getTracks().forEach((t) => t.stop());
//           return;
//         }
//         streamRef.current = stream;
//         videoRef.current.srcObject = stream;
//         await videoRef.current.play();
//         setCameraState("searching");
//         detectorStopRef.current = createQrDetector(
//           videoRef.current,
//           (data) => {
//             const expected = new URL(window.location.href);
//             const detectedUrl = (() => {
//               try {
//                 return new URL(data, window.location.origin);
//               } catch {
//                 return null;
//               }
//             })();
//             const detectedId = detectedUrl?.searchParams.get("id");
//             const isMatch =
//               detectedId ===
//                 new URLSearchParams(window.location.search).get("id") ||
//               data.includes(
//                 `id=${new URLSearchParams(window.location.search).get("id")}`,
//               );
//             if (isMatch) {
//               setFound(true);
//               setCameraState("found");
//             }
//           },
//           () => setFound(false),
//         );
//       } catch (e) {
//         if (!mounted) return;
//         setCameraState("error");
//         setError(
//           e?.message === "unsupported"
//             ? "Your browser does not support the camera experience."
//             : "Camera access is needed to bring this memory to life.",
//         );
//       }
//     }
//     start();
//     return () => {
//       mounted = false;
//       stopCamera();
//     };
//   }, []);

//   useEffect(() => {
//     const v = memoryVideoRef.current;
//     if (!v) return;
//     if (found) v.play().catch(() => {});
//     else v.pause();
//   }, [found]);

//   const playFallback = () => {
//     stopCamera();
//     setFallback(true);
//     setFound(true);
//     memoryVideoRef.current?.play().catch(() => {});
//   };

//   return (
//     <main className="camera-shell">
//       <video
//         ref={videoRef}
//         className="camera-feed"
//         playsInline
//         muted
//         aria-label="Camera view"
//       />
//       <div className="camera-vignette" />
//       <header className="camera-top">
//         <button className="icon-btn" onClick={onExit} aria-label="Close">
//           <X size={19} />
//         </button>
//         <div className="live-label">
//           <span className="live-dot" /> MEMORY LENS
//         </div>
//         <div className="camera-date">{memory.date}</div>
//       </header>
//       <div className="scan-zone">
//         <div className="corner tl" />
//         <div className="corner tr" />
//         <div className="corner bl" />
//         <div className="corner br" />
//         <div className="scan-line" />
//       </div>
//       <div className="scan-copy">
//         <Camera size={17} />
//         <span>
//           {cameraState === "error"
//             ? "Camera unavailable"
//             : found
//               ? "Memory found"
//               : "Point at your memory card"}
//         </span>
//       </div>
//       <section
//         className={`memory-overlay ${found ? "visible" : ""} ${fallback ? "fallback" : ""}`}
//       >
//         <div className="video-frame">
//           <video
//             ref={memoryVideoRef}
//             src={memory.videoUrl || undefined}
//             poster={memory.posterUrl || undefined}
//             playsInline
//             muted={muted}
//             preload="metadata"
//             controls={fallback}
//             onEnded={() => setFound(false)}
//           />
//           {!memory.videoUrl && (
//             <div className="video-placeholder">
//               <Heart size={28} fill="currentColor" />
//               <p>Add your video URL</p>
//               <small>
//                 Edit <b>src/data/memories.js</b>
//               </small>
//             </div>
//           )}
//           {found && memory.videoUrl && !fallback && (
//             <button className="sound-btn" onClick={() => setMuted((m) => !m)}>
//               {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
//             </button>
//           )}
//         </div>
//         <div className="memory-caption">
//           <span>{memory.date}</span>
//           <strong>{memory.title}</strong>
//           <em>{memory.subtitle}</em>
//         </div>
//       </section>
//       {cameraState === "error" && (
//         <div className="error-card">
//           <Heart size={18} />
//           <h2>Let the memory play another way.</h2>
//           <p>{error}</p>
//           <button onClick={playFallback}>
//             <Play size={16} /> Play memory
//           </button>
//         </div>
//       )}
//       {cameraState !== "error" && !found && (
//         <div className="search-hint">
//           <span>Searching for your memory…</span>
//           <div className="pulse">
//             <i />
//             <i />
//             <i />
//           </div>
//         </div>
//       )}
//       {cameraState === "error" && (
//         <button className="retry" onClick={() => window.location.reload()}>
//           <RotateCcw size={15} /> Try again
//         </button>
//       )}
//     </main>
//   );
// }

// New Code:
import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Camera, RotateCcw, X, Heart } from "lucide-react";
import { createQrDetector } from "../utils/markerDetector";

export default function CameraView({ memory, onExit }) {
  // Live camera
  const cameraRef = useRef(null);
  const streamRef = useRef(null);

  // Actual memory video
  const memoryVideoRef = useRef(null);

  // QR detector
  const detectorRef = useRef(null);

  const [cameraState, setCameraState] = useState("starting");
  const [errorMessage, setErrorMessage] = useState("");
  const [found, setFound] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fallback, setFallback] = useState(false);

  /*
   * ---------------------------------------------------------
   * CAMERA
   * ---------------------------------------------------------
   */

  const startCamera = async () => {
    setCameraState("starting");
    setErrorMessage("");
    setFallback(false);

    if (!window.isSecureContext) {
      setCameraState("error");
      setErrorMessage(
        "Camera access requires a secure connection. Please open this page using HTTPS.",
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("error");
      setErrorMessage(
        "This browser does not support camera access. Please use Chrome or Safari.",
      );
      return;
    }

    try {
      // Stop an existing camera stream.
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      const camera = cameraRef.current;

      if (!camera) {
        throw new Error("Camera preview element is unavailable.");
      }

      camera.srcObject = stream;
      camera.setAttribute("playsinline", "");
      camera.setAttribute("autoplay", "");
      camera.muted = true;

      await camera.play();

      setCameraState("ready");
    } catch (error) {
      console.error("Camera error:", error);

      let message =
        "We couldn't access your camera. Please allow camera access and try again.";

      switch (error?.name) {
        case "NotAllowedError":
        case "PermissionDeniedError":
          message =
            "Camera permission was denied. Please allow camera access in your browser settings and try again.";
          break;

        case "NotFoundError":
          message = "No camera was found on this device.";
          break;

        case "NotReadableError":
          message =
            "The camera is currently being used by another app. Close other camera/video apps and try again.";
          break;

        case "OverconstrainedError":
          message =
            "The requested camera configuration isn't available. Please try again.";
          break;

        case "SecurityError":
          message =
            "Camera access was blocked by the browser. Make sure you're using HTTPS.";
          break;

        default:
          message = `Camera couldn't start (${
            error?.name || "Unknown error"
          }). Please try again.`;
      }

      setErrorMessage(message);
      setCameraState("error");
    }
  };

  /*
   * ---------------------------------------------------------
   * START CAMERA / CLEANUP
   * ---------------------------------------------------------
   */

  useEffect(() => {
    startCamera();

    return () => {
      detectorRef.current?.stop?.();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      // detector.stop();
      detectorRef.current = null;
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * QR DETECTION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (cameraState !== "ready") return;

    const camera = cameraRef.current;

    if (!camera) return;

    const detector = createQrDetector(
      camera,

      // QR detected
      (data) => {
        console.log("QR detected:", data);
        console.log("Expected:", memory.id);

        if (data === memory.qrId) {
          console.log("✅ Memory QR matched:", memory.id);
          setFound(true);
        }
      },

      // QR lost
      () => {
        console.log("⏸️ QR lost");
        setFound(false);
      },
    );

    detectorRef.current = detector;

    return () => {
      console.log("Cleaned up QR detector");

      // detector.stop();
      detectorRef.current = null;
    };
  }, [cameraState, memory.id]);

  /*
   * ---------------------------------------------------------
   * MEMORY VIDEO
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const video = memoryVideoRef.current;

    if (!video) return;

    console.log("Memory video URL:", memory.videoUrl);

    // Reset the video whenever the memory changes.
    video.pause();
    video.currentTime = 0;

    if (memory.videoUrl) {
      video.src = memory.videoUrl;
      video.load();
    }
  }, [memory.videoUrl]);

  /*
   * ---------------------------------------------------------
   * PLAY / PAUSE MEMORY BASED ON QR
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const video = memoryVideoRef.current;

    if (!video || !memory.videoUrl) return;

    if (found) {
      console.log("▶️ QR found — attempting memory video playback");

      video
        .play()
        .then(() => {
          console.log("✅ Memory video is playing");
        })
        .catch((error) => {
          console.error("❌ Memory video playback failed:", error);

          // Keep muted playback available on mobile.
          video.muted = true;
          setMuted(true);

          video
            .play()
            .then(() => {
              console.log("✅ Memory video playing muted");
            })
            .catch((retryError) => {
              console.error("❌ Muted playback also failed:", retryError);
            });
        });
    } else {
      console.log("⏸️ QR lost — pausing memory video");

      video.pause();
    }
  }, [found, memory.videoUrl]);

  /*
   * ---------------------------------------------------------
   * VIDEO EVENTS
   * ---------------------------------------------------------
   */

  const handleVideoError = () => {
    const video = memoryVideoRef.current;

    console.error("❌ Memory video error:", video?.error);

    if (video?.error) {
      console.error("Video error code:", video.error.code);
      console.error("Video error message:", video.error.message);
    }
  };

  const handleVideoLoaded = () => {
    console.log("✅ Memory video loaded successfully");
  };

  /*
   * ---------------------------------------------------------
   * MUTE / UNMUTE
   * ---------------------------------------------------------
   */

  const toggleMute = () => {
    const video = memoryVideoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <main className="camera-shell">
      {/* =====================================================
          LIVE CAMERA
          ===================================================== */}

      <video
        ref={cameraRef}
        className="camera-feed"
        playsInline
        autoPlay
        muted
      />

      {/* Cinematic camera vignette */}
      <div className="camera-vignette" />

      {/* =====================================================
          TOP HEADER
          ===================================================== */}

      <header className="camera-top">
        {onExit ? (
          <button className="icon-btn" onClick={onExit} aria-label="Close">
            <X size={19} />
          </button>
        ) : (
          <div className="icon-btn-placeholder" />
        )}

        <div className="live-label">
          <span className="live-dot" />
          MEMORY LENS
        </div>

        <div className="camera-date">{memory.date}</div>
      </header>

      {/* =====================================================
                SCAN AREA
                ===================================================== */}

      <div className={`scan-zone ${found ? "scan-found" : ""}`}>
        <div className="corner tl" />
        <div className="corner tr" />
        <div className="corner bl" />
        <div className="corner br" />

        {!found && <div className="scan-line" />}
      </div>

      {/* =====================================================
                SCAN MESSAGE
                ===================================================== */}

      <div className="scan-copy">
        <Camera size={17} />

        <span>
          {cameraState === "error"
            ? "Camera unavailable"
            : found
              ? "Memory found"
              : "Point at your memory card"}
        </span>
      </div>

      {/* =====================================================
          MEMORY VIDEO
          This is intentionally a DIFFERENT video element.
          ===================================================== */}

      <section
        className={`memory-overlay ${
          found ? "visible" : ""
        } ${fallback ? "fallback" : ""}`}
      >
        <div className="video-frame">
          <video
            ref={memoryVideoRef}
            className={`memory-video ${found ? "memory-video-visible" : ""}`}
            playsInline
            preload="auto"
            muted={muted}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
            controls={fallback}
            onEnded={() => {
              if (!fallback) {
                setFound(false);
              }
            }}
          />

          {/* Sound control */}

          {found && memory.videoUrl && !fallback && (
            <button
              className="sound-btn"
              onClick={toggleMute}
              aria-label={muted ? "Unmute memory" : "Mute memory"}
            >
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
          )}
        </div>

        {/* Memory information */}

        <div className="memory-caption">
          <span>{memory.date}</span>
          <strong>{memory.title}</strong>
          <em>{memory.subtitle}</em>
        </div>
      </section>

      {/* =====================================================
          SEARCHING
          ===================================================== */}

      {cameraState !== "error" && !found && (
        <div className="search-hint">
          <span>Searching for your memory…</span>

          <div className="pulse">
            <i />
            <i />
            <i />
          </div>
        </div>
      )}

      {/* =====================================================
          CAMERA ERROR
          ===================================================== */}

      {cameraState === "error" && (
        <>
          <div className="error-card">
            <Heart size={18} />
            <h2>Let the memory play another way.</h2>
            <p>{errorMessage}</p>
          </div>

          <button className="retry" onClick={startCamera}>
            <RotateCcw size={15} />
            Try again
          </button>
        </>
      )}
    </main>
  );
}

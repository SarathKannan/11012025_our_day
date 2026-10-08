
import {
  Camera,
  Heart,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createQrDetector } from "../utils/markerDetector";

export default function CameraView({ memory, onExit }) {
  // ---------------------------------------------------------
  // VIDEO REFERENCES
  // ---------------------------------------------------------

  // Live phone camera
  const cameraRef = useRef(null);

  // Actual memory video
  const memoryVideoRef = useRef(null);

  // Camera stream
  const streamRef = useRef(null);

  // QR detector
  const detectorRef = useRef(null);

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------

  const [cameraState, setCameraState] = useState("requesting");
  const [found, setFound] = useState(false);
  const [muted, setMuted] = useState(true);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);

  // ---------------------------------------------------------
  // STOP CAMERA
  // ---------------------------------------------------------

  const stopCamera = () => {
    detectorRef.current?.stop?.();
    detectorRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }
  };

  // ---------------------------------------------------------
  // START CAMERA
  // ---------------------------------------------------------

  const startCamera = async () => {
    setCameraState("requesting");
    setError("");
    setFallback(false);

    if (!window.isSecureContext) {
      setCameraState("error");
      setError(
        "Camera access requires a secure connection. Please open this page using HTTPS.",
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("error");
      setError(
        "Your browser does not support the camera experience.",
      );
      return;
    }

    try {
      stopCamera();

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

      setCameraState("searching");
    } catch (e) {
      console.error("Camera error:", e);

      let message =
        "Camera access is needed to bring this memory to life.";

      switch (e?.name) {
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

        case "SecurityError":
          message =
            "Camera access was blocked by the browser. Make sure you're using HTTPS.";
          break;

        default:
          message =
            e?.message || message;
      }

      setError(message);
      setCameraState("error");
    }
  };

  // ---------------------------------------------------------
  // CAMERA LIFECYCLE
  // ---------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    async function start() {
      await startCamera();

      if (!mounted) {
        stopCamera();
      }
    }

    start();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, []);

  // ---------------------------------------------------------
  // QR DETECTION
  // ---------------------------------------------------------

  useEffect(() => {
    if (
      cameraState !== "searching" &&
      cameraState !== "found"
    ) {
      return;
    }

    const camera = cameraRef.current;

    if (!camera) return;

    // Stop any previous detector before creating a new one.
    detectorRef.current?.stop?.();

    const detector = createQrDetector(
      camera,

      // -----------------------------------------------------
      // QR DETECTED
      // -----------------------------------------------------

      (data) => {
        console.log("QR detected:", data);
        console.log("Expected:", memory.qrId);

        if (data === memory.qrId) {
          console.log(
            "✅ Memory QR matched:",
            memory.qrId,
          );

          setFound(true);
          setCameraState("found");
        }
      },

      // -----------------------------------------------------
      // QR LOST
      // -----------------------------------------------------

      () => {
        console.log("⏸️ QR lost");

        setFound(false);

        setCameraState((current) =>
          current === "found"
            ? "searching"
            : current,
        );
      },
    );

    detectorRef.current = detector;

    return () => {
      detector.stop();
      detectorRef.current = null;
    };
  }, [cameraState, memory.qrId]);

  // ---------------------------------------------------------
  // MEMORY VIDEO SETUP
  // ---------------------------------------------------------

  useEffect(() => {
    const video = memoryVideoRef.current;

    if (!video) return;

    console.log(
      "Memory video URL:",
      memory.videoUrl,
    );

    video.pause();
    video.currentTime = 0;

    if (memory.videoUrl) {
      video.src = memory.videoUrl;
      video.load();
    }
  }, [memory.videoUrl]);

  // ---------------------------------------------------------
  // PLAY / PAUSE MEMORY VIDEO
  // ---------------------------------------------------------

  useEffect(() => {
    const video = memoryVideoRef.current;

    if (!video || !memory.videoUrl) return;

    if (found) {
      console.log(
        "▶️ QR found — attempting memory video playback",
      );

      video
        .play()
        .then(() => {
          console.log(
            "✅ Memory video is playing",
          );
        })
        .catch((playError) => {
          console.error(
            "❌ Memory video playback failed:",
            playError,
          );

          // Mobile browsers allow muted autoplay more reliably.
          video.muted = true;
          setMuted(true);

          video
            .play()
            .then(() => {
              console.log(
                "✅ Memory video playing muted",
              );
            })
            .catch((retryError) => {
              console.error(
                "❌ Muted playback also failed:",
                retryError,
              );
            });
        });
    } else {
      console.log(
        "⏸️ QR lost — pausing memory video",
      );

      video.pause();
    }
  }, [found, memory.videoUrl]);

  // ---------------------------------------------------------
  // FALLBACK PLAY
  // ---------------------------------------------------------

  const playFallback = () => {
    stopCamera();

    setFallback(true);
    setFound(true);

    const video = memoryVideoRef.current;

    if (video) {
      video.muted = false;
      setMuted(false);

      video.play().catch((error) => {
        console.error(
          "Fallback video playback failed:",
          error,
        );
      });
    }
  };

  // ---------------------------------------------------------
  // MUTE / UNMUTE
  // ---------------------------------------------------------

  const toggleMute = () => {
    const video = memoryVideoRef.current;

    if (!video) return;

    video.muted = !video.muted;

    setMuted(video.muted);
  };

  // ---------------------------------------------------------
  // VIDEO ERROR
  // ---------------------------------------------------------

  const handleVideoError = () => {
    const video = memoryVideoRef.current;

    console.error(
      "❌ Memory video error:",
      video?.error,
    );

    if (video?.error) {
      console.error(
        "Video error code:",
        video.error.code,
      );

      console.error(
        "Video error message:",
        video.error.message,
      );
    }
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <main className="camera-shell">

      {/* =====================================================
          LIVE CAMERA
          ===================================================== */}

      <video
        ref={cameraRef}
        className="camera-feed"
        playsInline
        muted
        autoPlay
        aria-label="Camera view"
      />

      {/* Cinematic camera vignette */}

      <div className="camera-vignette" />

      {/* =====================================================
          TOP HEADER
          ===================================================== */}

      <header className="camera-top">

        {onExit ? (
          <button
            className="icon-btn"
            onClick={onExit}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        ) : (
          <div className="icon-btn-placeholder" />
        )}

        <div className="live-label">
          <span className="live-dot" />
          MEMORY LENS
        </div>

        <div className="camera-date">
          {memory.date}
        </div>

      </header>

      {/* =====================================================
          SCAN AREA
          ===================================================== */}

      <div
        className={`scan-zone ${
          found ? "scan-found" : ""
        }`}
      >

        <div className="corner tl" />
        <div className="corner tr" />
        <div className="corner bl" />
        <div className="corner br" />

        {!found && (
          <div className="scan-line" />
        )}

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
          ===================================================== */}

      <section
        className={`memory-overlay ${
          found ? "visible" : ""
        } ${fallback ? "fallback" : ""}`}
      >

        <div className="video-frame">

          <video
            ref={memoryVideoRef}
            src={
              memory.videoUrl ||
              undefined
            }
            poster={
              memory.posterUrl ||
              undefined
            }
            playsInline
            muted={muted}
            preload="auto"
            controls={fallback}
            onError={handleVideoError}
            onEnded={() => {
              if (!fallback) {
                setFound(false);
              }
            }}
          />

          {/* No video configured */}

          {!memory.videoUrl && (
            <div className="video-placeholder">

              <Heart
                size={28}
                fill="currentColor"
              />

              <p>Add your video URL</p>

              <small>
                Edit{" "}
                <b>
                  src/data/memories.js
                </b>
              </small>

            </div>
          )}

          {/* Sound control */}

          {found &&
            memory.videoUrl &&
            !fallback && (
              <button
                className="sound-btn"
                onClick={toggleMute}
                aria-label={
                  muted
                    ? "Unmute memory"
                    : "Mute memory"
                }
              >
                {muted ? (
                  <VolumeX size={17} />
                ) : (
                  <Volume2 size={17} />
                )}
              </button>
            )}

        </div>

        {/* Memory information */}

        <div className="memory-caption">

          <span>
            {memory.date}
          </span>

          <strong>
            {memory.title}
          </strong>

          <em>
            {memory.subtitle}
          </em>

        </div>

      </section>

      {/* =====================================================
          SEARCHING
          ===================================================== */}

      {cameraState !== "error" &&
        !found && (
          <div className="search-hint">

            <span>
              Searching for your memory…
            </span>

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

            <h2>
              Let the memory play another way.
            </h2>

            <p>
              {error}
            </p>

            {memory.videoUrl && (
              <button onClick={playFallback}>
                <Play size={16} />
                Play memory
              </button>
            )}

          </div>

          <button
            className="retry"
            onClick={startCamera}
          >
            <RotateCcw size={15} />
            Try again
          </button>
        </>
      )}

    </main>
  );
}

import React from "react";

import { ArrowRight, Heart } from "lucide-react";
import { memories } from "../data/memories";
import CameraView from "../components/CameraView";
import { useState } from "react";

export default function Home() {
  const memoryList = Object.values(memories);
  const [started, setStarted] = useState(false);

  const onStart = () => {
    setStarted(true);
  };

  if (started) {
    return <CameraView memories={memoryList} onExit={() => setStarted(false)} />;
  }

  return (
    <main className="home-shell">
      <div className="grain" />
      <div className="home-art">
        <span className="leaf leaf-a" />
        <span className="leaf leaf-b" />
        <span className="leaf leaf-c" />
        <span className="ring" />
      </div>
      <section className="home-content">
        <div className="eyebrow">
          <span>OUR LITTLE ARCHIVE</span>
          <i />
        </div>
        <p className="names">
          SARATH <span>&</span> HARMYA
        </p>
        <div className="home-title">
          <div className="small-script">a little memory</div>
          <h1>
            Some moments
            <br />
            <i>deserve to live twice.</i>
          </h1>
        </div>
        <p className="home-copy">
          A tiny corner of the story we started on a beach, one year ago.
        </p>
        {/* <a className="primary-btn" href={`/watch?id=first-meet`}>
          Open our first memory <ArrowRight size={17} />
        </a> */}
        <button className="primary-btn" onClick={onStart}>
          Let's see <ArrowRight size={17} />
        </button>
        <p className="home-note">
          <Heart size={12} fill="currentColor" /> made with love, not an
          algorithm
        </p>
      </section>
    </main>
  );
}

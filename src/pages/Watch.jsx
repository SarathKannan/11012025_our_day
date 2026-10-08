import React from "react";

import { memories } from "../data/memories";
import { useMemo, useState } from "react";
import IntroScreen from "../components/IntroScreen";
import CameraView from "../components/CameraView";

export default function Watch() {
  const id = new URLSearchParams(window.location.search).get("id");
  const memory = useMemo(() => memories[id], [id]);
  const [started, setStarted] = useState(false);
  if (!memory)
    return (
      <main className="missing">
        <div>
          <div className="small-script">a little memory</div>
          <h1>This memory couldn't be found.</h1>
          <p>Maybe this little moment was meant to stay between us. ♥</p>
          <a className="primary-btn" href="/">
            Back home
          </a>
        </div>
      </main>
    );
  if (!started)
    return <IntroScreen memory={memory} onStart={() => setStarted(true)} />;
  return <CameraView memory={memory} onExit={() => setStarted(false)} />;
}

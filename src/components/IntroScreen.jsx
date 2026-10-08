import { ArrowRight, Heart } from "lucide-react";
import React from "react";

export default function IntroScreen({ memory, onStart }) {
  return (
    <main className="intro-shell">
      <div className="grain" />
      <div className="intro-orb orb-one" />
      <div className="intro-orb orb-two" />
      <section className="intro-card">
        <div className="eyebrow">
          <span>11 · 10 · 2025</span>
          <i />
        </div>
        <p className="names">
          SARATH <span>&</span> HARMYA
        </p>
        <div className="title-wrap">
          <div className="small-script">a little memory</div>
          <h1>{memory?.title || "The Day It All Began"}</h1>
        </div>
        <p className="date">{memory?.date || "11.10.2025"}</p>
        <p className="message">
          {memory?.message ||
            "Some moments don't look important when they happen. Until you realise they changed everything."}
        </p>
        <button className="primary-btn" onClick={onStart}>
          Start memory <ArrowRight size={17} />
        </button>
        <div className="micro">
          <Heart size={12} fill="currentColor" /> made for us
        </div>
      </section>
    </main>
  );
}

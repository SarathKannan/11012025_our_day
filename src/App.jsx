import React from "react";

import Home from "./pages/Home";
import Watch from "./pages/Watch";
export default function App() {
  return window.location.pathname.startsWith("/watch") ? <Watch /> : <Home />;
}

"use client";

import dynamic from "next/dynamic";

/**
 * The studio reads localStorage on first render, so it is client-only.
 * A dark placeholder keeps the page from flashing white while it loads.
 */
const Studio = dynamic(() => import("./Studio").then((m) => m.Studio), {
  ssr: false,
  loading: () => <div className="h-dvh bg-studio-950" aria-busy="true" />,
});

export function StudioLoader() {
  return <Studio />;
}

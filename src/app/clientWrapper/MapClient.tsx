"use client";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../components/MapComp"), {
  ssr: false,
});

export const MapClientComp = () => {
  return <MapComponent />;
};

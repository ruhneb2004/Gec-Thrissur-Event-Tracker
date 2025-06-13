import { create } from "zustand";

export type MarkerType = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  color: string;
  time: Date;
  markerDisapperingTime: Date;
  certificateLink?: string;
  eventLink: string;
  creator: string;
};

type MarkerStore = {
  markers: MarkerType[];
  selectedMarker: MarkerType | null;
  markerOpen: boolean;
  setMarkerOpen: (open: boolean) => void;
  setSelectedMarker: (marker: MarkerType | null) => void;
  // addMarker: (marker: MarkerType) => void;
  loadMarkers: (markers: MarkerType[]) => void;
  // removeMarker: (id: string) => void;
  // updateMarker: (id: string, updatedFields: Partial<MarkerType>) => void;
};

/**
 * @dev we won't be using the add, remove and update methods here because we are fetching the markers from the API directly.
 *  I am requesting all the valid events based on the time and deleted boolean, so we don't need the add, remove and
 update methods here. We can handle that in the API routes directly. But for some optimizations in the future maybe we can use them so I am not deleting them entirely. But most likely this I will be the only one using this website so I am pretty sure no optimzations won't be needed.
 */

export const useMarkerStore = create<MarkerStore>((set) => ({
  markers: [],
  // addMarker: (marker) =>
  //   set((state) => ({
  //     markers: [...state.markers, marker],
  //   })),
  selectedMarker: null,
  markerOpen: false,
  loadMarkers: (newMarkers) => set({ markers: newMarkers }),
  setMarkerOpen: (open) => set({ markerOpen: open }),
  setSelectedMarker: (marker) => set({ selectedMarker: marker }),
  // removeMarker: (id) =>
  //   set((state) => ({
  //     markers: state.markers.filter((marker) => marker.id != id),
  //   })),
  // updateMarker: (id, updatedFields) =>
  //   set((state) => ({
  //     markers: state.markers.map((marker) =>
  //       marker.id === id ? { ...marker, ...updatedFields } : marker
  //     ),
  //   })),
}));

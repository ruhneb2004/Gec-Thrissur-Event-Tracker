"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMarkerStore } from "../store/markerStore";
import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useDateStore } from "../store/dateStore";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleX, Panda } from "lucide-react";
import { useAlertStore } from "../store/popUpCompsStore";
import { SheetComp } from "./SheetComp";
import { useEffect } from "react";
import { GoogleLogo } from "./googleIcon";
import { allowedColors, allowedEmails } from "@/lib/allowedEmailsAndColors";
import Link from "next/link";

const getColoredIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

// Fix for missing marker icons
// @ts-expect-error: _getIconUrl is a private property not typed in leaflet, ennu parayapedunnu
delete L.Icon.Default.prototype._getIconUrl;

export default function MapComponent() {
  const position: [number, number] = [10.553510655169237, 76.22198232986827];
  const { markers, loadMarkers, setSelectedMarker, setMarkerOpen } =
    useMarkerStore();
  const { startDate, endDate, setStartDate, setEndDate } = useDateStore();
  const {
    formErrorAlert,
    alertTitle,
    alertDescription,
    setFormDescription,
    setFormErrorAlert,
    setFormTitle,
  } = useAlertStore();

  function AddMarkerOnClick() {
    useMapEvents({
      click(e) {
        setSelectedMarker({
          id: crypto.randomUUID(),
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          title: "",
          description: "",
          time: startDate,
          markerDisapperingTime: endDate,
          eventLink: "",
          creator: session?.user?.email || "",
          color:
            allowedColors[
              allowedEmails.findIndex(
                (email: string) => email === session?.user?.email
              )
            ] || "red",
        });
        if (session?.user?.email) {
          setMarkerOpen(true);
        }
      },
    });
    return null;
  }

  const { data: session } = useSession();

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const res = await fetch("/api/eventMarker/getCurrentMarker");
        const data = await res.json();
        if (!res.ok) {
          return;
        }
        loadMarkers(data.data);
      } catch {
        setFormTitle("Error Adding Certificate Link");
        setFormDescription(
          "There was an error adding the certificate link. Please try again later."
        );
        setFormErrorAlert(true);
        setTimeout(() => {
          setFormErrorAlert(false);
        }, 5000);
      }
    };

    fetchMarkers();

    const intervalId = setInterval(() => {
      fetchMarkers();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [session]);

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute top-4 left-8 z-[1001] flex items-center gap-3 bg-white/70 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-200 shadow-sm text-gray-800 font-medium">
        <Panda />
        <span className="text-sm sm:text-base font-medium hidden md:inline-block">
          GECT Event Tracker
        </span>
      </div>
      <div className="absolute top-4 right-8 z-[1001] flex items-center gap-2">
        <Link
          href="/past-events"
          className="bg-white/70 text-gray-900 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition-all text-sm font-semibold"
        >
          📄 Events
        </Link>

        {session ? (
          <div className="flex items-center gap-1 sm:gap-4 bg-white/70 backdrop-blur-sm transition-all shadow-md px-3 py-2 rounded-full">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={
                  session.user?.image ||
                  "https://xsgames.co/randomusers/avatar.php?g=pixel"
                }
              />
              <AvatarFallback>
                {session.user?.name
                  ? session.user.name.charAt(0).toUpperCase()
                  : session.user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-800 font-medium truncate max-w-[120px] hidden sm:inline-block">
              {session.user?.name || session.user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="rounded-full hover:bg-red-100 hover:text-red-800 transition"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 bg-white/70 text-gray-900 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
          >
            <GoogleLogo />

            <span className="hidden sm:inline-block">
              Login with GECT Email
            </span>
          </Button>
        )}
      </div>
      {formErrorAlert && (
        <Alert
          variant="destructive"
          className="fixed top-4 left-1/2 -translate-x-1/2 w-[50%] z-[1000]"
        >
          <CircleX />
          <AlertTitle>{alertTitle}</AlertTitle>
          <AlertDescription>{alertDescription}</AlertDescription>
        </Alert>
      )}
      <SheetComp />
      <MapContainer
        center={position}
        zoom={18}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddMarkerOnClick />
        {markers
          .filter(
            (marker) =>
              typeof marker.lat === "number" && typeof marker.lng === "number"
          )
          .map((marker, index) => (
            <Marker
              icon={getColoredIcon(marker.color || "red")}
              key={index}
              position={[marker.lat, marker.lng]}
              eventHandlers={{
                click: () => {
                  setMarkerOpen(true);
                  setSelectedMarker(marker);
                  setStartDate(marker.time);
                  setEndDate(marker.markerDisapperingTime);
                },
              }}
            >
              <Popup>{marker.title}</Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

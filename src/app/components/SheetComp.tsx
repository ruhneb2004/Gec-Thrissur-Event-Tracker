import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@radix-ui/react-label";
import { DateTimePicker24h } from "@/components/ui/dateAndTimePicker";
import { useMarkerStore } from "../store/markerStore";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useDateStore } from "../store/dateStore";
import { useAlertStore } from "../store/popUpCompsStore";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import axios from "axios";

export const SheetComp = () => {
  const {
    selectedMarker,
    // removeMarker,
    setSelectedMarker,
    markerOpen,
    // addMarker,
    // updateMarker,
    setMarkerOpen,
  } = useMarkerStore();
  const { setFormErrorAlert, setFormTitle, setFormDescription } =
    useAlertStore();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const { startDate, endDate } = useDateStore();
  const [going, setGoing] = useState(
    () =>
      selectedMarker?.Attending?.some(
        (attendee) => attendee.userId === (session?.user as { id: string })?.id
      ) || false
  );

  useEffect(() => {
    const userId = (session?.user as { id: string })?.id;
    const attending =
      selectedMarker?.Attending?.some(
        (attendee) => attendee.userId === userId
      ) || false;
    setGoing(attending);
  }, [selectedMarker, session]);

  const setGoingStatus = async () => {
    const status = !going;
    const userId = (session?.user as { id: string })?.id;
    console.log(selectedMarker);

    console.log("userId", userId);
    try {
      const setStatus = await axios.post("/api/eventMarker/setGoingStatus", {
        userId: userId,
        status: status,
        eventId: selectedMarker?.id || "",
      });
      console.log("setStatus", setStatus);
      setGoing((status) => !status);
    } catch (error) {
      console.log(error);
      setFormTitle("Error Setting Status");
      setFormDescription(
        "There was an error updating your attendance status. Please try again later."
      );
      setFormErrorAlert(true);
      setTimeout(() => {
        setFormErrorAlert(false);
      }, 5000);
    }
  };

  const deleteMarker = async () => {
    if (!selectedMarker) return;

    try {
      const res = await fetch("/api/eventMarker/deleteEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markerId: selectedMarker.id }),
      });

      if (!res.ok) {
        setFormTitle("Error Deleting Marker");
        setFormDescription(
          "Deletion failed. Please try again or contact support."
        );
        setFormErrorAlert(true);
        setTimeout(() => setFormErrorAlert(false), 5000);
        return;
      }

      //   removeMarker(selectedMarker.id);
    } catch {
      setFormErrorAlert(true);
      setFormTitle("Error Deleting Marker");
      setFormDescription("An error occurred while deleting the marker.");
      setTimeout(() => setFormErrorAlert(false), 3000);
    } finally {
      setSelectedMarker(null);
      setMarkerOpen(false);
    }
  };

  const saveEventChanges = async () => {
    if (!selectedMarker) return;
    if (
      !selectedMarker.title.trim() ||
      !selectedMarker.description.trim() ||
      !selectedMarker.eventLink.trim()
    ) {
      setFormErrorAlert(true);
      setFormTitle("Incomplete Data Fields");
      setFormDescription("Please fill in all required fields.");
      setTimeout(() => setFormErrorAlert(false), 3000);
      return;
    }

    selectedMarker.time = startDate;
    selectedMarker.markerDisapperingTime = endDate;

    const payload = {
      ...selectedMarker,
      time: new Date(selectedMarker.time).toISOString(),
      markerDisapperingTime: new Date(
        selectedMarker.markerDisapperingTime
      ).toISOString(),
    };

    try {
      const res = await fetch("/api/eventMarker/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setFormTitle(res.statusText);
        setFormDescription(
          "SignIn using from allowed emails(foss@gectcr.ac.in etc...)"
        );
        setFormErrorAlert(true);
        setTimeout(() => setFormErrorAlert(false), 5000);
        return;
      }

      setMarkerOpen(false);
    } catch {
      setFormErrorAlert(true);
      setTimeout(() => setFormErrorAlert(false), 3000);
    }
  };

  return (
    <Sheet open={markerOpen} onOpenChange={setMarkerOpen}>
      <SheetContent side="right" className="z-[1001] overflow-visible">
        <SheetHeader className="flex flex-col gap-5">
          <SheetTitle className="text-2xl font-semibold text-gray-900">
            {selectedMarker?.title || "Unnamed Event"}
          </SheetTitle>

          <div className="overflow-y-auto max-h-[calc(100vh-100px)] pr-1 mt-4">
            {selectedMarker ? (
              selectedMarker.creator === userEmail ? (
                // Editable version
                <div className="flex flex-col gap-5">
                  <div>
                    <Label
                      htmlFor="event-name"
                      className="block mb-1 text-sm text-gray-700"
                    >
                      Event Name
                    </Label>
                    <input
                      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      value={selectedMarker.title}
                      onChange={(e) =>
                        setSelectedMarker({
                          ...selectedMarker,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="event-description"
                      className="block mb-1 text-sm text-gray-700"
                    >
                      Event Description
                    </Label>
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md h-40 resize-none focus:outline-none focus:ring focus:ring-blue-200"
                      value={selectedMarker.description}
                      onChange={(e) =>
                        setSelectedMarker({
                          ...selectedMarker,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="event-link"
                      className="block mb-1 text-sm text-gray-700"
                    >
                      Event Link
                    </Label>
                    <input
                      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      value={selectedMarker.eventLink}
                      onChange={(e) =>
                        setSelectedMarker({
                          ...selectedMarker,
                          eventLink: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="event-start"
                      className="block mb-1 text-sm text-gray-700"
                    >
                      Event Starting Time
                    </Label>
                    <DateTimePicker24h type="start" />
                  </div>

                  <div>
                    <Label
                      htmlFor="event-end"
                      className="block mb-1 text-sm text-gray-700"
                    >
                      Event Ending Time
                    </Label>
                    <DateTimePicker24h type="end" />
                  </div>

                  <span className="text-xs text-gray-500">
                    Created at: {selectedMarker.time.toLocaleString()}
                  </span>

                  <div className="flex justify-between gap-1 mb-4">
                    <Button
                      className="w-[50%] bg-red-100 text-red-800 hover:bg-red-200"
                      onClick={deleteMarker}
                    >
                      Delete Event
                    </Button>
                    <Button
                      className="w-[50%] bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      onClick={saveEventChanges}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                // Read-only version
                <div className="text-sm text-gray-800 space-y-5 ">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md shadow-sm">
                    <p className="font-semibold text-yellow-800">
                      ⏰ Event Starts:
                    </p>
                    <p className="ml-2">
                      {format(
                        new Date(selectedMarker.time.toLocaleString()),
                        "dd-MM-yyyy, HH:mm"
                      )}
                    </p>
                  </div>

                  <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded-md shadow-sm">
                    <p className="font-semibold text-gray-800">
                      🎤 What&apos;s Happening?
                    </p>
                    <p className="ml-2">{selectedMarker.description}</p>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md shadow-sm">
                    <p className="font-semibold text-green-800">
                      🌐 Dive in here:
                    </p>
                    <a
                      href={
                        selectedMarker.eventLink.startsWith("http")
                          ? selectedMarker.eventLink
                          : `https://${selectedMarker.eventLink}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-green-700 underline hover:text-green-900 transition"
                    >
                      {selectedMarker.eventLink}
                    </a>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={setGoingStatus}
                      className={`relative flex items-center justify-center gap-2 px-5 py-2 w-fit text-sm font-medium rounded-full transition-all duration-300 border 
      ${
        going
          ? "bg-green-600 text-white border-transparent shadow-md hover:bg-green-700"
          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
      }`}
                    >
                      {going ? "✅ Attending" : "➕ I'm Going"}
                    </button>
                  </div>
                </div>
              )
            ) : (
              <SheetDescription className="text-gray-500 italic">
                No marker selected
              </SheetDescription>
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

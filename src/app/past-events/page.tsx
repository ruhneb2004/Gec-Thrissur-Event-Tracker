"use client";

import { useEffect, useState } from "react";
import { useMarkerStore } from "../store/markerStore";
import axios from "axios";
import {
  useAlertStore,
  useCertificateLinkModalStore,
} from "../store/popUpCompsStore";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { CertificateLinkModal } from "../components/CertificateLinkModal";

export default function Page() {
  const { loadMarkers, markers } = useMarkerStore();
  const { setFormErrorAlert, setFormTitle, setFormDescription } =
    useAlertStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const { setCertificateLinkModalOpen, setEventId, setCertificateLink } =
    useCertificateLinkModalStore();

  useEffect(() => {
    const getEventMarkers = async () => {
      try {
        const res = await axios.post("/api/eventMarker/getAllEventMarker", {
          searchQuery: "", // Add searchQuery here if there are too many events, for small number of events it's overkill and also feels very laggy ;(
        });

        loadMarkers(res.data.data);
      } catch {
        setFormTitle("Error Fetching Events");
        setFormDescription(
          "There was an error fetching the event markers. Please try again later."
        );
        setFormErrorAlert(true);
        setTimeout(() => {
          setFormErrorAlert(false);
        }, 5000);
      }
    };
    const delay = setTimeout(() => {
      getEventMarkers();
    }, 500);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const filteredMarkers = markers.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCertificateModal = (
    eventId: string,
    eventCertificateLink: string
  ) => {
    setCertificateLinkModalOpen(true);
    setEventId(eventId);
    setCertificateLink(eventCertificateLink);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <CertificateLinkModal />
      <header className="relative w-full overflow-hidden bg-white py-12 sm:py-24 px-6 sm:px-10 mb-16 max-w-6xl mx-auto">
        <div className="absolute left-0 top-0 h-full w-2 bg-blue-200 rounded-r-lg shadow-sm"></div>
        <div className="absolute top-[-60px] right-[-60px] h-64 w-64 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-80px] left-[20%] h-40 w-40 bg-blue-50 rounded-full blur-2xl opacity-30"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-10">
          <div className="max-w-3xl  space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Echoes of GEC
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              From sleepless hackathons to electrifying fests, here&apos;s a
              living archive of everything GEC has celebrated
            </p>
          </div>

          <div className="w-full sm:w-[24rem] relative">
            <input
              type="text"
              placeholder="Type an event, theme, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-300 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-gray-800 text-base transition-all"
            />
            <span className="absolute left-4 top-1/4 -translate-y-1/4 text-blue-400 text-4xl">
              ⌕
            </span>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="relative border-l border-gray-200 pl-6 space-y-10">
          {filteredMarkers.map((event) => {
            const isCreator = session?.user?.email === event.creator;

            return (
              <div key={event.id} className="relative group">
                <div className="absolute -left-[10px] top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow-sm group-hover:bg-blue-500 transition-colors" />
                <div className="bg-gray-50 hover:bg-gray-100 transition rounded-md px-4 py-3 shadow-sm border border-gray-100 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        {new Date(event.time).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {event.title}
                      </h2>
                    </div>
                    {isCreator && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-500 text-white dark:bg-blue-600"
                      >
                        Your Event
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {event.description}
                  </p>

                  {event.certificateLink && !isCreator && (
                    <a
                      href={
                        event.certificateLink.startsWith("http")
                          ? event.certificateLink
                          : `https://${event.certificateLink}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      {}
                      🎓 View Certificates
                    </a>
                  )}

                  {isCreator && (
                    <button
                      onClick={() =>
                        openCertificateModal(
                          event.id,
                          event.certificateLink || ""
                        )
                      }
                      className="text-sm text-blue-600 hover:underline mt-2"
                    >
                      ✏️ Manage Certificates
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {filteredMarkers.length === 0 && (
          <p className="text-center text-gray-400 italic">
            No events match your search.
          </p>
        )}
      </div>
    </main>
  );
}

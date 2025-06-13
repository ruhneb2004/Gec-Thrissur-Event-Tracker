import { create } from "zustand";

type AlertStore = {
  formErrorAlert: boolean;
  alertTitle: string;
  alertDescription: string;
  setFormErrorAlert: (value: boolean) => void;
  setFormTitle: (title: string) => void;
  setFormDescription: (description: string) => void;
};

export const useAlertStore = create<AlertStore>((set) => ({
  formErrorAlert: false,
  alertTitle: "Error",
  alertDescription: "Please fill in all required fields.",
  setFormTitle: (title) => set({ alertTitle: title }),
  setFormDescription: (description) => set({ alertDescription: description }),
  setFormErrorAlert: (value) => set({ formErrorAlert: value }),
}));

type certificateLinkModalStore = {
  certificateLinkModalOpen: boolean;
  eventId: string;
  certificateLink?: string;
  setCertificateLink: (link: string) => void;
  setEventId: (id: string) => void;
  setCertificateLinkModalOpen: (open: boolean) => void;
};

export const useCertificateLinkModalStore = create<certificateLinkModalStore>(
  (set) => ({
    certificateLinkModalOpen: false,
    eventId: "",
    setEventId: (id) => set({ eventId: id }),
    setCertificateLink: (link) => set({ certificateLink: link }),
    setCertificateLinkModalOpen: (open) =>
      set({ certificateLinkModalOpen: open }),
    set,
  })
);

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAlertStore,
  useCertificateLinkModalStore,
} from "../store/popUpCompsStore";
import axios from "axios";

export const CertificateLinkModal = () => {
  const {
    certificateLinkModalOpen,
    setCertificateLinkModalOpen,
    eventId,
    setCertificateLink,
    certificateLink,
  } = useCertificateLinkModalStore();
  const { setFormErrorAlert, setFormTitle, setFormDescription } =
    useAlertStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/eventMarker/addCertificate", {
        certificateLink: certificateLink,
        markerId: eventId,
      });

      setCertificateLinkModalOpen(false);
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

  return (
    <Dialog
      open={certificateLinkModalOpen}
      onOpenChange={setCertificateLinkModalOpen}
    >
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add certificate link</DialogTitle>
            <DialogDescription>
              Add a link to the certificates here, google drive links are
              preferred.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="username-1">Certificate Link</Label>
            <Input
              placeholder="https://drive.google.com/..."
              defaultValue={certificateLink}
              onChange={(e) => {
                setCertificateLink(e.target.value);
              }}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

import React, { useState } from "react";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import useGlobalPopup from "@/store/useGlobalPopup";
import { is } from "date-fns/locale";
import { useAuthStore } from "@/store/useAuthStore";

export default function TokenPopup() {
  const isOpen = useGlobalPopup((state) => state.isOpen);
  const closeDialog = useGlobalPopup((state) => state.closePopup);
  const setToken = useAuthStore((state) => state.setToken);
  const [inputVal, setInputVal] = useState<string | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Key</DialogTitle>
          <DialogDescription>
            For this integration to work, you need to provide an Monday.com
            developer API key.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="token" onChange={(e) => setInputVal(e.target.value)} />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={closeDialog}>
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => {
              if (!inputVal) return;
              setToken(inputVal);
              closeDialog();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

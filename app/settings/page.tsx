"use client";

import React from "react";
import { Copy, ClipboardPaste, SaveIcon, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, ToastOptions } from "react-toastify";

const toastOptions: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  onClick: (e) => {
    toast.dismiss();
  },
};

export default function SettingsPage() {
  const defaultToken = localStorage.getItem("token");
  const [token, setToken] = React.useState<string | null>(null);

  const handleActions = (action: "copy" | "paste" | "undo" | "save") => {
    toast.dismiss();
    switch (action) {
      case "copy":
        navigator.clipboard.writeText(token ?? "");
        toast("Copied to clipboard", toastOptions);
        break;
      case "paste":
        navigator.clipboard.readText().then((text) => setToken(text));
        toast("Pasted successfully", toastOptions);
        break;
      case "undo":
        setToken(defaultToken || "");
        toast("Undo made", toastOptions);
        break;
      case "save":
        if (!token) return;
        localStorage.setItem("token", token);
        toast("Saved successfully", toastOptions);
        break;
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold">API Key</h1>
      {/* Description */}
      <p className="text-muted-foreground">
        For this integration to work, you need to provide an Monday.com
        developer API key. <br />
        This will gain access only to your name, your boards names and ID's and
        the items in the Work Clock board.
      </p>
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2 my-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="token"
            placeholder="Your API Key"
            value={token ?? defaultToken ?? ""}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <Button
          size="sm"
          className="px-3"
          onClick={handleActions.bind(null, "copy")}
        >
          <span className="sr-only">Copy</span>
          <Copy />
        </Button>
        <Button
          size="sm"
          className="px-3"
          onClick={handleActions.bind(null, "paste")}
        >
          <span className="sr-only">Paste</span>
          <ClipboardPaste />
        </Button>
        <Button
          size="sm"
          className="px-3"
          onClick={handleActions.bind(null, "undo")}
        >
          <span className="sr-only">Undo</span>
          <Undo2 />
        </Button>
        <Button
          size="sm"
          className="px-3"
          onClick={handleActions.bind(null, "save")}
        >
          <span className="sr-only">Save</span>
          <SaveIcon />
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { Camera, ChevronRight, Loader2, ScanLine } from "lucide-react";
import { findOrder } from "../lib/api";
import type { Order } from "../types";

export default function Scanner({
  onOrder,
  onMessage,
}: {
  onOrder: (order: Order) => void;
  onMessage: (type: "success" | "error", text: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const scanLockRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [looking, setLooking] = useState(false);
  const [found, setFound] = useState(false);

  useEffect(() => () => controlsRef.current?.stop(), []);

  async function lookup(value: string) {
    setLooking(true);
    try {
      const result = await findOrder(value);
      if (result.success && result.order) {
        onOrder(result.order);
        onMessage("success", result.message);
      } else {
        onMessage("error", result.message);
      }
    } finally {
      setLooking(false);
      scanLockRef.current = false;
    }
  }

  async function start() {
    if (!videoRef.current) return;
    try {
      const reader = new BrowserMultiFormatReader();
      controlsRef.current = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          // Guard against the decode loop firing more than once for the
          // same code before the camera has actually stopped.
          if (!result || scanLockRef.current) return;
          scanLockRef.current = true;

          setFound(true);
          window.setTimeout(() => setFound(false), 500);

          controlsRef.current?.stop();
          controlsRef.current = null;
          setOpen(false);

          void lookup(result.getText());
        }
      );
      setOpen(true);
    } catch (err) {
      const denied =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      onMessage(
        "error",
        denied
          ? "Camera permission denied. Allow camera access or use manual order entry."
          : "Camera unavailable. Use manual order entry instead."
      );
      setOpen(false);
    }
  }

  function stop() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setOpen(false);
  }

  return (
    <div className="scanner-card">
      <div className="scanner-heading">
        <div><span>01</span><h2>Scan order</h2></div>
        <ScanLine size={20} />
      </div>

      <div className={`scanner-viewport${found ? " found" : ""}`}>
        <video ref={videoRef} muted playsInline />
        {!open && (
          <div className="scanner-placeholder">
            <Camera size={28} />
            <strong>Ready to scan</strong>
            <small>QR or barcode</small>
          </div>
        )}
        {open && <div className="scanner-sweep" />}
        <div className="scanner-frame" />
      </div>

      <button className="scanner-primary" onClick={open ? stop : start} disabled={looking}>
        <Camera size={16} /> {open ? "Stop camera" : "Start camera"}
      </button>

      <div className="scanner-or">OR ENTER ORDER CODE</div>

      <form
        className="scanner-manual"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim() && !looking) void lookup(code);
        }}
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="RX-1042"
          aria-label="Order code"
          disabled={looking}
        />
        <button type="submit" disabled={looking || !code.trim()}>
          {looking ? (
            <>
              <Loader2 size={15} className="spin" /> Looking up
            </>
          ) : (
            <>
              Find <ChevronRight size={15} />
            </>
          )}
        </button>
      </form>

      <small className="scanner-demo">Demo: RX-1042 · RX-1043 · RX-1044</small>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { captureMeasurementEntry } from "@/lib/measurement-client";

export function MeasurementEntry() {
  useEffect(() => { captureMeasurementEntry(); }, []);
  return null;
}

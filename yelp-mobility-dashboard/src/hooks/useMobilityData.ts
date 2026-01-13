// src/hooks/useMobilityData.ts
import { useEffect, useState } from "react";
import Papa from "papaparse";

export type MobilitySummary = {
  singleHubPercent: number;
  twoHubPercent: number;
  avgHubSeparation: number;   // km
  medianTravelRange: number;  // km
};

export type UserMobilityRow = Record<string, string | number | null>;

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function useMobilityData() {
  const [summary, setSummary] = useState<MobilitySummary | null>(null);
  const [rows, setRows] = useState<UserMobilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);

        // 1) JSON
        const sRes = await fetch("/data/mobility_summary.json");
        if (!sRes.ok) throw new Error("Failed to load mobility_summary.json");
        const raw = await sRes.json();

        // Map JSON -> UI shape
        const mapped: MobilitySummary = {
          singleHubPercent: round1(raw.one_area_pct),
          twoHubPercent: round1(raw.two_area_pct),
          avgHubSeparation: round1(raw.avg_hub_distance_km),
          medianTravelRange: round1(raw.typical_travel_range_km),
        };

        // 2) CSV
        const cRes = await fetch("/data/user_mobility_table.csv");
        if (!cRes.ok) throw new Error("Failed to load user_mobility_table.csv");
        const csvText = await cRes.text();

        const parsed = Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        if (parsed.errors?.length) {
          throw new Error(parsed.errors[0].message);
        }

        if (!cancelled) {
          setSummary(mapped);
          setRows((parsed.data as any[]) ?? []);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { summary, rows, loading, error };
}

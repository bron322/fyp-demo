import { useEffect, useState } from "react";
import { parseCsv } from "@/lib/csv";

export type DatasetStats = {
  totalUsers: number;
  totalReviews: number;
  totalBusinesses: number;
  totalTips: number;
  totalCheckins: number;
};

export type CityData = {
  city: string;
  state: string;
  businessCount: number;
  sampleReviews: number;
};

export type StateRow = {
  state: string;
  fullName: string;
  businessCount: number;
};

const STATE_FULLNAME: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

export function useOverviewData() {
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [topCities, setTopCities] = useState<CityData[]>([]);
  const [topStates, setTopStates] = useState<StateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, citiesRes, statesRes] = await Promise.all([
          fetch("/data/overview_stats.json"),
          fetch("/data/top_cities.csv"),
          fetch("/data/state_coverage.csv"),
        ]);

        if (!statsRes.ok) throw new Error("Failed to load overview_stats.json");
        if (!citiesRes.ok) throw new Error("Failed to load top_cities.csv");
        if (!statesRes.ok) throw new Error("Failed to load state_coverage.csv");

        const statsJson = await statsRes.json();
        const citiesCsv = await citiesRes.text();
        const statesCsv = await statesRes.text();

        const nextStats: DatasetStats = {
          totalUsers: Number(statsJson.total_users ?? 0),
          totalReviews: Number(statsJson.reviews ?? 0),
          totalBusinesses: Number(statsJson.restaurants ?? 0),
          totalTips: Number(statsJson.tips ?? 0),
          totalCheckins: Number(statsJson.checkins ?? 0),
        };

        const cityRows = parseCsv(citiesCsv).map((r) => ({
          city: r.city,
          state: r.state,
          businessCount: Number(r.restaurants ?? 0),
          sampleReviews: Number(r.sample_reviews ?? 0),
        }));

        const stateRows = parseCsv(statesCsv).map((r) => {
          const abbr = (r.state ?? "").toUpperCase();
          return {
            state: abbr,
            fullName: STATE_FULLNAME[abbr] ?? abbr,
            businessCount: Number(r.restaurants ?? 0),
          };
        });

        if (!cancelled) {
          setStats(nextStats);
          setTopCities(cityRows);
          setTopStates(stateRows);
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

  return { stats, topCities, topStates, loading, error };
}

/**
 * UC3 — Senior Engineer retention case.
 * Three scenarios and 11 teammates whose salaries get re-rendered
 * relative to the picked scenario.
 */

export type ScenarioId = "conservative" | "mid" | "retention";

export type Scenario = {
  id: ScenarioId;
  label: string;
  amount: number;
  delta: string;
  budget: string;
  riskLine: string;
  rationale: string;
};

export const scenarios: Scenario[] = [
  {
    id: "conservative",
    label: "Conservative",
    amount: 148000,
    delta: "+1.4%",
    budget: "+$2.5K/yr",
    riskLine: "High — won't retain",
    rationale: "Likely won't retain him.",
  },
  {
    id: "mid",
    label: "Mid",
    amount: 158000,
    delta: "+8.2%",
    budget: "+$12K/yr",
    riskLine: "Medium — within market range",
    rationale: "Matches market median. Fair to teammates.",
  },
  {
    id: "retention",
    label: "Retention",
    amount: 168000,
    delta: "+15.1%",
    budget: "+$22K/yr",
    riskLine: "Low — but flags 2 peers",
    rationale: "Above market. Would require raising peers too.",
  },
];

export type Peer = {
  id: string;
  name: string;
  level: string;
  tenure: string;
  base: number;
  /** Optional: this peer is "close to Marcus" — visually highlighted in some scenarios. */
  flagWhenSelected?: ScenarioId[];
};

/** Marcus's id is "marcus". */
export const peers: Peer[] = [
  { id: "peerA", name: "Peer A", level: "Senior", tenure: "4 yrs", base: 162000 },
  { id: "peerB", name: "Peer B", level: "Senior", tenure: "3 yrs", base: 159000, flagWhenSelected: ["retention"] },
  { id: "marcus", name: "Marcus L.", level: "Senior", tenure: "2 yrs", base: 146000 },
  { id: "peerC", name: "Peer C", level: "Senior", tenure: "2 yrs", base: 154000, flagWhenSelected: ["retention"] },
  { id: "peerD", name: "Peer D", level: "Mid-level", tenure: "1 yr", base: 138000 },
];

export const marketRange = { min: 130000, max: 180000, median: 158000 };

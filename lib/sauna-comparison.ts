export const comparisonPairs = ["all", "outdoor-indoor", "outdoor-infrared", "indoor-infrared"] as const;
export const projectUses = ["home", "cottage", "commercial"] as const;
export const serviceScopes = ["unsure", "supply", "assembly", "managed"] as const;
export type SaunaApproach = "outdoor" | "indoor" | "infrared";
export type ComparisonState = {
  compare: typeof comparisonPairs[number];
  use: typeof projectUses[number];
  service: typeof serviceScopes[number];
};
type Search = Record<string, string | string[] | undefined>;

function choice<T extends string>(value: Search[string], choices: readonly T[], fallback: T): T {
  return typeof value === "string" && choices.includes(value as T) ? value as T : fallback;
}

export function readComparison(search: Search): ComparisonState {
  return {
    compare: choice(search.compare, comparisonPairs, "all"),
    use: choice(search.use, projectUses, "home"),
    service: choice(search.service, serviceScopes, "unsure"),
  };
}

export function comparisonApproaches(state: ComparisonState): SaunaApproach[] {
  return state.compare === "all" ? ["outdoor", "indoor", "infrared"] : state.compare.split("-") as SaunaApproach[];
}

export function comparisonQuery(state: ComparisonState) {
  return new URLSearchParams(state).toString();
}

export function comparisonQuoteQuery(state: ComparisonState, approach: SaunaApproach | "unsure", source: string) {
  return new URLSearchParams({
    interest: approach,
    use: state.use,
    service: state.service,
    // Infrared is a heating approach; the permitted environment depends on the cabin.
    placement: approach === "infrared" ? "unsure" : approach,
    heat: approach === "infrared" ? "infrared" : "unsure",
    source,
  }).toString();
}

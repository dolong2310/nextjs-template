import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

const workplaceItems = ["remote", "onsite", "hybrid"] as const;
const typeItems = ["full-time", "part-time", "contract", "freelance"] as const;
const levelItems = ["junior", "mid", "senior", "lead", "principal"] as const;

export const jobSearchParams = {
  q: parseAsString,
  tags: parseAsString,
  location: parseAsString,
  company: parseAsString,
  workplace: parseAsStringLiteral(workplaceItems),
  type: parseAsStringLiteral(typeItems),
  level: parseAsStringLiteral(levelItems),
  salary_min: parseAsInteger,
  salary_max: parseAsInteger,
  salary_floor_min: parseAsInteger,
  posted_within_days: parseAsInteger,
  limit: parseAsInteger.withDefault(30),
  page: parseAsInteger.withDefault(1),
};

export const loadJobSearchParams = createLoader(jobSearchParams);

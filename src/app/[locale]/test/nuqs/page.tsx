import type { SearchParams } from "nuqs/server";
import { getCompanies, getJobs, getTags } from "./_components/api";
import TestNuqsClientPage from "./_components/client.page";
import { loadJobSearchParams } from "./_components/search-params";

type Props = {
  searchParams: Promise<SearchParams>;
};

const TestNuqsPage = async ({ searchParams }: Props) => {
  const filters = await loadJobSearchParams(searchParams);

  const [jobs, tags, companies] = await Promise.all([
    getJobs(filters),
    getTags(),
    getCompanies(),
  ]);

  return <TestNuqsClientPage jobs={jobs} tags={tags} companies={companies} />;
};

export default TestNuqsPage;

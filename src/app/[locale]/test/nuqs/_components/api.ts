import { HttpClient } from "@/libs/api/http-client";
import { CompaniesResponse, JobFilters, JobResponse, TagsResponse } from "./types";

export const getJobs = async (
  filters: JobFilters,
  options?: { signal?: AbortSignal },
) => {
  try {
    const res = await HttpClient.get<JobResponse>(
      {
        baseUrl: "https://aidevboard.com/api/v1",
        endpoint: "/jobs",
        query: filters,
      },
      { signal: options?.signal },
    );
    return res;
  } catch (error) {
    console.error("error getting jobs: ", error);
    throw error;
  }
};

export const getTags = async (options?: { signal?: AbortSignal }) => {
  try {
    const res = await HttpClient.get<TagsResponse>(
      {
        baseUrl: "https://aidevboard.com/api/v1",
        endpoint: "/tags",
      },
      { signal: options?.signal },
    );
    return res.tags;
  } catch (error) {
    console.error("error getting tags: ", error);
    throw error;
  }
};

export const getCompanies = async (options?: { signal?: AbortSignal }) => {
  try {
    const res = await HttpClient.get<CompaniesResponse>(
      {
        baseUrl: "https://aidevboard.com/api/v1",
        endpoint: "/companies",
      },
      { signal: options?.signal },
    );
    return res.companies;
  } catch (error) {
    console.error("error getting tags: ", error);
    throw error;
  }
}

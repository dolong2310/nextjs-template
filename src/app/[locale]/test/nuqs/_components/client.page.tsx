"use client";

import { useEffect, useMemo, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash-es";
import { useQueryStates } from "nuqs";
import { getCompanies, getJobs, getTags } from "./api";
import { jobSearchParams } from "./search-params";
import { Company, JobFilters, JobResponse, Tag } from "./types";
import { formatTag } from "./utils";

type Props = {
  jobs: JobResponse;
  tags: Tag;
  companies: Company[];
};

const workplaceOptions = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
] as const;

const typeOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
] as const;

const levelOptions = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "principal", label: "Principal" },
] as const;

export default function TestNuqsClientPage({ jobs, tags, companies }: Props) {
  const searchRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const salaryMinRef = useRef<HTMLInputElement>(null);
  const salaryMaxRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useQueryStates(jobSearchParams, {
    shallow: true,
    clearOnDefault: true,
  });

  const updateFilters = useMemo(
    () =>
      debounce((value: string, key: keyof JobFilters) => {
        void setFilters({
          [key]: value || null,
          page: 1,
        });
      }, 300),
    [setFilters],
  );

  useEffect(() => {
    return () => updateFilters.cancel();
  }, [updateFilters]);

  const queryJobs = useQuery({
    queryKey: ["jobs", filters],
    queryFn: ({ signal }) => {
      // console.log("trigger query!!!");
      // return new Promise((resolve) => {
      //   resolve("123");
      // });
      return getJobs(filters, { signal });
    },
    initialData: jobs,
    staleTime: 0,
  });

  const queryTags = useQuery({
    queryKey: ["tags"],
    queryFn: ({ signal }) => getTags({ signal }),
    initialData: tags,
    select: (data) =>
      Object.keys(data).map((key) => ({
        label: formatTag(key),
        value: key,
      })),
  });

  const queryCompanies = useQuery({
    queryKey: ["companies"],
    queryFn: ({ signal }) => getCompanies({ signal }),
    initialData: companies,
  });

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col gap-4 w-64">
        <Input
          ref={searchRef}
          placeholder="Search"
          defaultValue={filters.q ?? ""}
          onChange={(event) => updateFilters(event.target.value, "q")}
        />

        <Input
          ref={locationRef}
          placeholder="Location"
          defaultValue={filters.location ?? ""}
          onChange={(event) => updateFilters(event.target.value, "location")}
        />

        <Input
          ref={salaryMinRef}
          type="number"
          placeholder="Salary Min"
          defaultValue={filters.salary_min ? String(filters.salary_min) : ""}
          onChange={(event) => updateFilters(event.target.value, "salary_min")}
        />

        <Input
          ref={salaryMaxRef}
          type="number"
          placeholder="Salary Max"
          defaultValue={filters.salary_max ? String(filters.salary_max) : ""}
          onChange={(event) => updateFilters(event.target.value, "salary_max")}
        />

        <Combobox
          multiple={{
            showSelectAll: true,
            maxCount: 3,
            maxSelectCount: 5,
          }}
          items={queryTags.data ?? []}
          value={filters.tags?.split(",").filter(Boolean) ?? []}
          onValueChange={(value) => {
            setFilters({
              tags: value.join(","),
              page: 1,
            });
          }}
          disabled={queryTags.isPending}
        >
          <ComboboxTrigger placeholder="Tags" />
          <ComboboxContent align="center">
            <ComboboxInput placeholder="Search tags..." />
            <ComboboxEmpty>No tags found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item.value}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Combobox
          items={
            queryCompanies.data?.map((item) => ({
              label: item.name,
              value: item.slug,
            })) ?? []
          }
          value={filters.company ?? ""}
          onValueChange={(value) => {
            setFilters({
              company: value,
              page: 1,
            });
          }}
          disabled={queryCompanies.isPending}
        >
          <ComboboxTrigger placeholder="Companies" />
          <ComboboxContent>
            <ComboboxInput placeholder="Search companies..." />
            <ComboboxEmpty>No companies found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item.value}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Select
          value={filters.workplace ?? ""}
          onValueChange={(value: NonNullable<typeof filters.workplace>) => {
            setFilters({
              workplace: value,
              page: 1,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Workplace" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {workplaceOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={filters.type ?? ""}
          onValueChange={(value: NonNullable<typeof filters.type>) => {
            setFilters({
              type: value,
              page: 1,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {typeOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={filters.level ?? ""}
          onValueChange={(value: NonNullable<typeof filters.level>) => {
            setFilters({
              level: value,
              page: 1,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {levelOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          onClick={() => {
            updateFilters.cancel();
            [searchRef, locationRef, salaryMinRef, salaryMaxRef].forEach(
              (ref) => {
                if (ref.current) {
                  ref.current.value = "";
                }
              },
            );
            void setFilters(null);
          }}
        >
          Clear
        </Button>
      </div>

      <div className="w-[800px] h-[1000px] overflow-x-hidden">
        <Table className="w-full">
          <TableCaption className="text-foreground">
            A list of jobs.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Company name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Workplace</TableHead>
              <TableHead>Job type</TableHead>
              <TableHead>Experience level</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Apply URL</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryJobs.data.jobs?.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company_name}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.workplace}</TableCell>
                <TableCell>{job.job_type}</TableCell>
                <TableCell>{job.experience_level}</TableCell>
                <TableCell>
                  {job.salary_min} - {job.salary_max}
                </TableCell>
                <TableCell>{job.tags.join(", ")}</TableCell>
                <TableCell>{job.apply_url}</TableCell>
                <TableCell>{job.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

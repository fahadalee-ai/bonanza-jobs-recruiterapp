import { annualMax, annualMin, milesBetween } from "./format";
import { CITIES, type Job } from "./mock-data";

export type JobFilters = {
  q: string;
  location: string;
  radius: number;
  jobTypes: string[];
  workModes: string[];
  industry: string;
  experience: string;
  salary: [number, number];
  posted: "any" | "1" | "7" | "30";
};

export const EMPTY_FILTERS: JobFilters = {
  q: "",
  location: "",
  radius: 25,
  jobTypes: [],
  workModes: [],
  industry: "",
  experience: "",
  salary: [40000, 220000],
  posted: "any",
};

export function filterJobs(jobs: Job[], filters: JobFilters) {
  const q = filters.q.trim().toLowerCase();
  const origin = CITIES.find((city) => city.label.toLowerCase() === filters.location.trim().toLowerCase());
  return jobs.filter((job) => {
    if (q) {
      const hay = [job.title, job.company, job.industry, job.city, job.locationLabel, ...job.skills]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.jobTypes.length && !filters.jobTypes.includes(job.jobType)) return false;
    if (filters.workModes.length && !filters.workModes.includes(job.workMode)) return false;
    if (filters.industry && job.industry !== filters.industry) return false;
    if (filters.experience && job.experience !== filters.experience) return false;
    if (filters.posted !== "any" && job.postedDays > Number(filters.posted)) return false;
    const low = annualMin(job.salaryMin, job.salaryUnit);
    const high = annualMax(job.salaryMax, job.salaryUnit);
    if (high < filters.salary[0] || low > filters.salary[1]) return false;
    if (filters.location.trim()) {
      if (job.workMode === "Remote") return filters.workModes.length === 0 || filters.workModes.includes("Remote");
      if (origin?.coords && job.coords) return milesBetween(origin.coords, job.coords) <= filters.radius;
      const label = `${job.city}, ${job.state}`.toLowerCase();
      return label.includes(filters.location.trim().toLowerCase()) || job.locationLabel.toLowerCase().includes(filters.location.trim().toLowerCase());
    }
    return true;
  });
}

export function sortJobs(jobs: Job[], sort: "relevant" | "newest" | "salary" | "match") {
  const copy = [...jobs];
  if (sort === "newest") copy.sort((a, b) => a.postedDays - b.postedDays);
  else if (sort === "salary") copy.sort((a, b) => annualMax(b.salaryMax, b.salaryUnit) - annualMax(a.salaryMax, a.salaryUnit));
  else copy.sort((a, b) => b.match - a.match);
  return copy;
}

export function filtersActive(filters: JobFilters) {
  return (
    Boolean(filters.location) ||
    filters.jobTypes.length > 0 ||
    filters.workModes.length > 0 ||
    Boolean(filters.industry) ||
    Boolean(filters.experience) ||
    filters.posted !== "any" ||
    filters.salary[0] !== 40000 ||
    filters.salary[1] !== 220000 ||
    filters.radius !== 25
  );
}

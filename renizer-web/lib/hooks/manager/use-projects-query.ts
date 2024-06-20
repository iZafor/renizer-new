import { getProjects } from "@/lib/apis/manager/projects/apis";

export const useProjectsQueryOptions = (managerId: string) => ({
    queryKey: ["projects"],
    queryFn: async () => getProjects(managerId),
});

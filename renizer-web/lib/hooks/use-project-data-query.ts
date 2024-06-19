import { getProjectData } from "@/lib/apis/project/apis";

export const useProjectDataQueryOptions = (id: string) => {
    const queryKey = ["projectData", id];
    const queryFn = async () => getProjectData(id);
    return { queryKey, queryFn };
};

import {
    getCollaboratorsDetails,
    getInvestorsDetails,
    getProjectCollaborations,
    getProjectDetails,
    getProjectInvestments,
    getProjectTasks,
} from "@/lib/apis/manager/project/apis";

export const useProjectDetailsQueryOptions = (projectId: string) => ({
    queryKey: ["projectDetails", projectId],
    queryFn: async () => getProjectDetails(projectId),
});

export const useCollaboratorsDetailsQueryOptions = (projectId: string) => ({
    queryKey: ["collaboratorsDetails", projectId],
    queryFn: async () => getCollaboratorsDetails(projectId),
});

export const useProjectCollaborationsQueryOptions = (projectId: string) => ({
    queryKey: ["projectCollaborations", projectId],
    queryFn: async () => getProjectCollaborations(projectId),
});

export const useInvestorsDetailsQueryOptions = () => ({
    queryKey: ["investorsDetails"],
    queryFn: getInvestorsDetails,
});

export const useProjectInvestmentsQueryOptions = (projectId: string) => ({
    queryKey: ["projectInvestments", projectId],
    queryFn: async () => getProjectInvestments(projectId),
});

export const useProjectTasksQueryOptions = (projectId: string) => ({
    queryKey: ["projectTasks", projectId],
    queryFn: async () => getProjectTasks(projectId),
});

import ProjectView from "@/components/ui/manager/project/project-view";
import {
    useCollaboratorsDetailsQueryOptions,
    useInvestorsDetailsQueryOptions,
    useProjectCollaborationsQueryOptions,
    useProjectDetailsQueryOptions,
    useProjectInvestmentsQueryOptions,
    useProjectTasksQueryOptions,
} from "@/lib/hooks/manager/use-project-query";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

interface ProjectProps {
    params: {
        id: string;
    };
}

export default async function Project({ params: { id } }: ProjectProps) {
    const queryClient = new QueryClient();
    await Promise.all([
        queryClient.prefetchQuery(useProjectDetailsQueryOptions(id)),
        queryClient.prefetchQuery(useCollaboratorsDetailsQueryOptions(id)),
        queryClient.prefetchQuery(useProjectCollaborationsQueryOptions(id)),
        queryClient.prefetchQuery(useInvestorsDetailsQueryOptions()),
        queryClient.prefetchQuery(useProjectInvestmentsQueryOptions(id)),
        queryClient.prefetchQuery(useProjectTasksQueryOptions(id)),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProjectView id={id} />
        </HydrationBoundary>
    );
}

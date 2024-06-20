import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

import ProjectsTable from "@/components/ui/manager/projects/projects-table";
import { useProjectsQueryOptions } from "@/lib/hooks/manager/use-projects-query";

export default async function Projects() {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(
        useProjectsQueryOptions("928fd1c4-26dc-11ef-b68d-0045e2d4f24d")
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProjectsTable />
        </HydrationBoundary>
    );
}

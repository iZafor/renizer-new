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
        useProjectsQueryOptions("4f3b3e2d-7737-4e0e-945a-8d80b2ec6156")
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProjectsTable />
        </HydrationBoundary>
    );
}

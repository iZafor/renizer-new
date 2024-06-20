import ProjectView from "@/components/ui/manager/project/project-view";
import { useProjectDataQueryOptions } from "@/lib/hooks/manager/use-project-data-query";
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
    await queryClient.prefetchQuery(useProjectDataQueryOptions(id));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProjectView id={id} />
        </HydrationBoundary>
    );
}

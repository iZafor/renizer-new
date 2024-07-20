import {
    useProducedEnergyBasedOnEnergySourceQueryOptions,
    useProducedEnergyPerYearBasedOnEnergySourceQueryOptions,
    useProjectsBasedOnEnergySourceQueryOptions,
    useProjectsOverviewDataQueryOptions,
} from "@/lib/hooks/manager/use-analytics-query";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { AnalyticsContainer } from "@/components/ui/manager/analytics/analytics-container";

const managerId = "4f3b3e2d-7737-4e0e-945a-8d80b2ec6156";

export default async function Analytics() {
    const queryClient = new QueryClient();
    await Promise.all([
        queryClient.prefetchQuery(
            useProjectsOverviewDataQueryOptions(managerId)
        ),
        queryClient.prefetchQuery(
            useProjectsBasedOnEnergySourceQueryOptions(managerId)
        ),
        queryClient.prefetchQuery(
            useProducedEnergyBasedOnEnergySourceQueryOptions(managerId)
        ),
        queryClient.prefetchQuery(
            useProducedEnergyPerYearBasedOnEnergySourceQueryOptions(managerId)
        ),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AnalyticsContainer managerId={managerId} />
        </HydrationBoundary>
    );
}

import {
    getInvestmentBasedOnEnergySource,
    getProducedEnergyBasedOnEnergySource,
    getProducedEnergyPerYearBasedOnEnergySource,
    getProjectsBasedOnEnergySource,
    getProjectsOverviewData,
} from "@/lib/apis/manager/analytics/apis";

export const useProjectsOverviewDataQueryOptions = (managerId: string) => ({
    queryKey: ["projectOverviewData", managerId],
    queryFn: async () => getProjectsOverviewData(managerId),
});

export const useProjectsBasedOnEnergySourceQueryOptions = (
    managerId: string
) => ({
    queryKey: ["projectsBasedOnEnergySource", managerId],
    queryFn: async () => getProjectsBasedOnEnergySource(managerId),
});

export const useProducedEnergyBasedOnEnergySourceQueryOptions = (
    managerId: string
) => ({
    queryKey: ["producedEnergyBasedOnEnergySource", managerId],
    queryFn: async () => getProducedEnergyBasedOnEnergySource(managerId),
});

export const useInvestmentBasedOnEnergySourceQueryOptions = (
    managerId: string
) => ({
    queryKey: ["investmentBasedOnEnergySource", managerId],
    queryFn: async () => getInvestmentBasedOnEnergySource(managerId),
});

export const useProducedEnergyPerYearBasedOnEnergySourceQueryOptions = (
    managerId: string
) => ({
    queryKey: ["producedEnergyPerYearBasedOnEnergySource", managerId],
    queryFn: async () => getProducedEnergyPerYearBasedOnEnergySource(managerId),
});

"use client";

import { ManagerIdContext } from "@/lib/contexts/manager";
import ProjectOverview from "@/components/ui/manager/analytics/project-overview";
import ProjectsBasedOnEnergySourcePieChart from "./projects-based-on-energy-source-pie-chart";
import EnergyProductionBasedOnEnergySourcePieChart from "./energy-production-based-on-energy-source-pie-chart";
import InvestmentBasedOnEnergySourcePieChart from "./investment-based-on-energy-source-pie-chart";
import EnergyProductionPerYearBasedOnEnergySource from "./production-per-year-based-on-energy-source-bar-chart";

export function AnalyticsContainer({ managerId }: { managerId: string }) {
    return (
        <ManagerIdContext.Provider value={managerId}>
            <div className="space-y-4">
                <ProjectOverview />
                <div className="flex justify-between gap-4">
                    <ProjectsBasedOnEnergySourcePieChart />
                    <EnergyProductionBasedOnEnergySourcePieChart />
                </div>
                <div className="flex justify-between gap-4">
                    <InvestmentBasedOnEnergySourcePieChart />
                    <EnergyProductionPerYearBasedOnEnergySource />
                </div>
            </div>
        </ManagerIdContext.Provider>
    );
}

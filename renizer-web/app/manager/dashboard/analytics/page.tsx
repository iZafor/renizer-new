import dynamic from "next/dynamic";

import ProjectOverview from "@/components/ui/manager/analytics/project-overview";
const TaskStatusChart = dynamic(
    () => import("@/components/ui/manager/analytics/task-status-chart"),
    { ssr: false }
);
const TaskPerformanceChart = dynamic(
    () => import("@/components/ui/manager/analytics/task-performance-chart"),
    { ssr: false }
);
const EnergyProductionSalesChart = dynamic(
    () =>
        import(
            "@/components/ui/manager/analytics/energy-production-sales-chart"
        ),
    { ssr: false }
);
const InvestmentInsightsChart = dynamic(
    () => import("@/components/ui/manager/analytics/investment-insights-chart"),
    { ssr: false }
);
import { Card } from "@/components/ui/card";

export default function Analytics() {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h2>Project Status Summary</h2>
                <ProjectOverview />
            </div>
            <div className="w-full flex gap-4">
                <div className="space-y-2 w-[60%]">
                    <h2>Task Status</h2>
                    <Card className="h-[40rem]">
                        <TaskStatusChart />
                    </Card>
                </div>
                <div className="space-y-2 w-[40%]">
                    <h2>Task Distribution</h2>
                    <Card className="h-[40rem]">
                        <TaskPerformanceChart />
                    </Card>
                </div>
            </div>
            <div className="space-y-2">
                <h2>Energy Production & Sales</h2>
                <EnergyProductionSalesChart />
            </div>
            <div className="space-y-2">
                <h2>Investment Insights</h2>
                <InvestmentInsightsChart />
            </div>
        </div>
    );
}

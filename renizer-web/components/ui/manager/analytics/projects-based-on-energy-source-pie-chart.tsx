import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});
import { ApexOptions } from "apexcharts";
import { useContext } from "react";
import { ManagerIdContext } from "@/lib/contexts/manager";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useProjectsBasedOnEnergySourceQueryOptions } from "@/lib/hooks/manager/use-analytics-query";
import { useTheme } from "next-themes";

export default function ProjectsBasedOnEnergySourcePieChart() {
    const managerId = useContext(ManagerIdContext);
    const { data } = useQuery(
        useProjectsBasedOnEnergySourceQueryOptions(managerId)
    );
    const labels = data?.map((d) => d.energy_source);
    const series = data?.map((d) => d.count);
    const { theme } = useTheme();

    const options: ApexOptions = {
        labels,
        chart: {
            background: "transparent",
            toolbar: {
                show: false,
            },
            type: "pie",
        },
        dataLabels: {
            formatter: (_, { seriesIndex }) => series?.[seriesIndex]!,
        },
        theme: {
            palette: "palette7",
            mode: theme as "dark" | "light",
        },
    };

    return (
        <div className="space-y-2 w-1/2">
            <h2>Energy Sources of Projects</h2>
            <Card className="h-[32rem] w-[100%] grid place-items-center custom-tooltip">
                <ReactApexChart
                    type="pie"
                    options={options}
                    series={series}
                    width="620px"
                    height="502px"
                />
            </Card>
        </div>
    );
}

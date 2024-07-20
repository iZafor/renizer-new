import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});
import { ApexOptions } from "apexcharts";
import { useContext } from "react";
import { ManagerIdContext } from "@/lib/contexts/manager";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useProducedEnergyBasedOnEnergySourceQueryOptions } from "@/lib/hooks/manager/use-analytics-query";
import { useTheme } from "next-themes";
import { formatEnergyUnit } from "@/lib/utils";

export default function EnergyProductionBasedOnEnergySourcePieChart() {
    const managerId = useContext(ManagerIdContext);
    const { data } = useQuery(
        useProducedEnergyBasedOnEnergySourceQueryOptions(managerId)
    );
    const labels = data?.map((d) => d.energy_source);
    const series = data?.map((d) => d.produced_wh);
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
        theme: {
            palette: "palette2",
            mode: theme as "dark" | "light",
        },
        tooltip: {
            y: {
                formatter: (_, { seriesIndex }) =>
                    formatEnergyUnit(series?.[seriesIndex]!),
            },
        },
    };

    return (
        <div className="space-y-2 w-1/2">
            <h2>Energy Production from Different Energy Sources</h2>
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

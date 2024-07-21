import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});
import { ApexOptions } from "apexcharts";
import { useContext, useEffect, useState } from "react";
import { ManagerIdContext } from "@/lib/contexts/manager";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useProducedEnergyPerYearBasedOnEnergySourceQueryOptions } from "@/lib/hooks/manager/use-analytics-query";
import { useTheme } from "next-themes";
import { ProducedEnergyPerYearBasedOnEnergySource as DType } from "@/lib/definitions";
import ComboBox from "@/components/ui/combo-box";

const unitMap: { [key: string]: number } = {
    Wh: 1,
    KWh: 1000,
    MWh: 1000000,
    GWh: 1000000000,
};
const defaultUnit = "GWh";

export default function EnergyProductionPerYearBasedOnEnergySource() {
    const managerId = useContext(ManagerIdContext);
    const { theme } = useTheme();
    const [unit, setUnit] = useState(defaultUnit);
    const [series, setSeries] = useState<ApexAxisChartSeries>([]);
    const { data } = useQuery(
        useProducedEnergyPerYearBasedOnEnergySourceQueryOptions(managerId)
    );
    const categories = (data as DType)["years"];

    const options: ApexOptions = {
        chart: {
            background: "transparent",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: categories,
        },
        legend: {
            position: "top",
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: "end",
                dataLabels: {
                    position: "top",
                    orientation: "vertical",
                },
            },
        },
        theme: {
            mode: (theme as "dark" | "light") || "dark",
        },
        tooltip: {
            y: {
                formatter: (val) => `${val} ${unit}`,
            },
        },
    };

    useEffect(() => {
        const newSeries: ApexAxisChartSeries = [];
        for (const source in (data as DType)["data"]) {
            const currSeries: { name: string; data: number[] } = {
                name: source,
                data: [],
            };
            for (const y of categories) {
                const energy = (data as DType)["data"][source][y] || 0;
                currSeries.data.push(
                    energy
                        ? Number((energy / unitMap[unit]).toFixed(2))
                        : energy
                );
            }
            newSeries.push(currSeries);
        }
        setSeries(newSeries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unit]);

    return (
        <div className="space-y-2 w-1/2">
            <h2>
                Energy Production Per Year Based on Different Energy Sources
            </h2>
            <Card className="h-[32rem] relative">
                <ComboBox
                    className="absolute right-2 top-2 z-50"
                    values={Object.keys(unitMap)}
                    triggerButtonText="Unit"
                    inputPlaceholder="Unit"
                    containerAlignment="end"
                    containerClassName="w-[10rem]"
                    defaultValue={defaultUnit}
                    onStateUpdate={(newUnit) => setUnit(newUnit)}
                />
                <ReactApexChart
                    type="bar"
                    options={options}
                    series={series}
                    height="100%"
                    width="100%"
                />
            </Card>
        </div>
    );
}

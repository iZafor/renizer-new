"use client";

import { useTheme } from "next-themes";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ComboBox from "@/components/ui/combo-box";
import { useState } from "react";
import { formatEnergyUnit } from "@/lib/utils";
import { startSVG } from "@/lib/apex-chart";
import { Card } from "@/components/ui/card";

type ProductionSalesData = {
    summary: string[];
    series: ApexAxisChartSeries;
};

function getRandomData(size: number = 10): ProductionSalesData {
    const producedEnergy = Array.from({ length: size }, () =>
        Number((Math.random() * 10000 + 10000).toFixed(0))
    );
    const soldEnergy = producedEnergy.map(
        (v) => v - Number((Math.random() * 1000 + 5000).toFixed(0))
    );

    return {
        summary: [
            producedEnergy.reduce((v1, v2) => v1 + v2).toString(),
            soldEnergy.reduce((v1, v2) => v1 + v2).toString(),
        ],
        series: [
            {
                type: "area",
                name: "Energy Produced",
                data: producedEnergy,
            },
            {
                type: "area",
                name: "Energy Sold",
                data: soldEnergy,
            },
            {
                type: "area",
                name: "Energy Rate",
                data: Array.from({ length: size }, () =>
                    Number((Math.random() * 10 + 10).toFixed(0))
                ),
            },
        ],
    };
}

const fontSize = "14px";

export default function EnergyProductionSalesChart() {
    const { theme } = useTheme();
    const [prodSalesData, setProdSalesData] = useState(getRandomData());

    const options: ApexOptions = {
        chart: {
            background: "transparent",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: [
                Date.parse("01-20-2022"),
                Date.parse("02-20-2022"),
                Date.parse("03-20-2022"),
                Date.parse("04-20-2022"),
                Date.parse("05-20-2022"),
                Date.parse("06-20-2022"),
                Date.parse("07-20-2022"),
                Date.parse("08-20-2022"),
                Date.parse("09-20-2022"),
                Date.parse("10-20-2022"),
            ],
            type: "datetime",
            labels: {
                style: {
                    fontSize: fontSize,
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: fontSize,
                },
            },
        },
        theme: {
            palette: "palette2",
            mode: (theme as "dark" | "light") || "dark",
        },
        stroke: {
            curve: "smooth",
            width: 6,
        },
        legend: {
            fontSize: fontSize,
            itemMargin: {
                horizontal: 20,
            },
            markers: {
                fillColors: ["transparent", "transparent"],
                offsetY: -8,
                offsetX: -8,
                customHTML() {
                    return startSVG;
                },
            },
            customLegendItems: prodSalesData.summary,
            formatter(legendName, opts) {
                return (
                    (opts.seriesIndex === 0
                        ? "Total Energy Produced"
                        : "Total Energy Sold") +
                    ": " +
                    formatEnergyUnit(Number(legendName))
                );
            },
            position: "top",
        },
        tooltip: {
            y: {
                formatter(val, opts) {
                    return opts.seriesIndex === 2
                        ? `$${val}`
                        : formatEnergyUnit(val);
                },
            },
        },
    };

    return (
        <Card className="h-[40rem] grid gap-1.5 p-4">
            <ComboBox
                className="justify-self-end"
                values={[
                    "Solar Scape",
                    "Wind Whisper",
                    "Hydro Harbor",
                    "Geothermal Glow",
                    "Biomass Bloom",
                ]}
                triggerButtonText="Project"
                defaultValue="Solar Scape"
                inputPlaceholder="Project"
                onStateUpdate={() => setProdSalesData(getRandomData())}
            />
            <ReactApexChart
                options={options}
                series={prodSalesData.series}
                height="88%"
            />
        </Card>
    );
}

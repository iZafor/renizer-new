"use client";

import ReactApexChart from "react-apexcharts";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import ComboBox from "@/components/ui/combo-box";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const totalInvestmentData = {
    series: [
        {
            name: "Total Investment",
            data: [100000, 150000, 200000, 250000, 300000],
        },
    ],
};

function getRandomInvestmentTrendsData() {
    return {
        categories: [
            "2023-01",
            "2023-02",
            "2023-03",
            "2023-04",
            "2023-05",
            "2023-06",
        ],
        series: [
            {
                name: "Investment Amount",
                data: Array.from({ length: 6 }, () =>
                    Number((Math.random() * 10000 + 10000).toFixed(0))
                ),
            },
        ],
    };
}

export default function InvestmentInsightsChart() {
    const { theme } = useTheme();
    const [investmentTrendsData, setInvestmentTrendsData] = useState(
        getRandomInvestmentTrendsData()
    );

    const totalInvestmentOptions: ApexOptions = {
        chart: {
            type: "bar",
            background: "transparent",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: [
                "Solar Scape",
                "Wind Whisper",
                "Hydro Harbor",
                "Geothermal Glow",
                "Biomass Bloom",
            ],
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: "end",
            },
        },
        title: {
            text: "Total Investment Amount",
        },
        theme: {
            mode: (theme as "dark" | "light") || "dark",
            palette: "palette2",
        },
        tooltip: {
            y: {
                formatter(val) {
                    return `$${val}`;
                },
            },
        },
    };

    const investmentTrendsOptions: ApexOptions = {
        chart: {
            type: "line",
            background: "transparent",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: investmentTrendsData.categories,
            type: "datetime",
        },
        title: {
            text: "Investment Trends Over Time",
        },
        theme: {
            mode: (theme as "dark" | "light") || "dark",
            palette: "palette1",
        },
        stroke: {
            curve: "smooth",
            width: 6,
        },
        tooltip: {
            y: {
                formatter(val) {
                    return `$${val}`;
                },
            },
        },
    };

    return (
        <div className="flex flex-wrap justify-between">
            <Card className="w-[49.5%] p-4">
                <ReactApexChart
                    options={totalInvestmentOptions}
                    series={totalInvestmentData.series}
                    type="bar"
                />
            </Card>
            <Card className="w-[49.5%] p-4 relative">
                <ComboBox
                    className="justify-self-end absolute right-4 z-50"
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
                    onStateUpdate={() =>
                        setInvestmentTrendsData(getRandomInvestmentTrendsData())
                    }
                />
                <ReactApexChart
                    options={investmentTrendsOptions}
                    series={investmentTrendsData.series}
                    type="line"
                />
            </Card>
        </div>
    );
}

"use client";

import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const colors = [
    "#1E90FF", // Total Tasks
    "#008080", // Tasks Per Contributor
    "#DAA520", // Avg. Completion Day
];

const series: ApexAxisChartSeries = [
    {
        name: "Total Tasks",
        data: [17, 23, 17, 38, 39],
    },
    {
        name: "Tasks Per Contributor",
        data: [2, 3, 2, 4, 4.5],
    },
    {
        name: "Avg. Completion Day",
        data: [2, 3, 2, 4, 4.5],
    },
];

const fontSize = "14px";

export default function TaskPerformanceChart() {
    const { theme } = useTheme();
    const [categories, setCategories] = useState<string[]>([]);
    const [series, setSeries] = useState<ApexAxisChartSeries>([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(
                `/api/manager/dashboard/analytics/task-performance`
            ).then((res) => res.json());
            const newCategories = Object.keys(res);

            const totalTasks = [];
            const tasksPerContributor = [];
            const avgTasks = [];
            for (const project of newCategories) {
                totalTasks.push(res[project]["Total Tasks"]);
                const taskPerContributor =
                    res[project]["Tasks Per Contributor"];
                const avgTask = res[project]["Avg. Completion Day"];
                if (taskPerContributor) {
                    tasksPerContributor.push(taskPerContributor);
                }
                if (avgTask) {
                    avgTasks.push(avgTask);
                }
            }
            const newSeries = [
                { name: "Total Tasks", data: totalTasks },
                { name: "Tasks Per Contributor", data: tasksPerContributor },
                { name: "Avg. Completion Day", data: avgTasks },
            ];
            setCategories(newCategories);
            setSeries(newSeries);
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const options: ApexOptions = {
        chart: {
            background: "transparent",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: categories,
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
        dataLabels: {
            style: {
                fontSize: fontSize,
            },
        },
        legend: {
            fontSize: fontSize,
            position: "top",
            horizontalAlign: "left",
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: "end",
            },
        },
        theme: {
            mode: (theme as "dark" | "light") || "dark",
        },
        tooltip: {
            style: {
                fontSize: fontSize,
            },
        },
        colors: colors,
    };

    return (
        <ReactApexChart
            type="bar"
            options={options}
            series={series}
            height="100%"
        />
    );
}

"use client";

import ReactApexChart from "react-apexcharts";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import { ProjectTaskStatus } from "@/lib/definitions";
import { useEffect, useState } from "react";

const statusColors = [
    "rgb(59, 130, 246)", // In progress
    "rgb(34, 197, 94)", // Done
    "rgb(239, 68, 68)", // Canceled
    "rgb(234, 179, 8)", // Not Started Yet
    "rgb(253, 224, 71)", // Overdue
];

const defaultSeries: ApexAxisChartSeries = [
    {
        name: "In progress",
        data: [10, 13, 16, 19, 20],
    },
    {
        name: "Done",
        data: [3, 6, 5, 9, 12],
    },
    {
        name: "Canceled",
        data: [1, 0, 2, 3, 1],
    },
    {
        name: "Not Started Yet",
        data: [2, 3, 2, 4, 3],
    },
    {
        name: "Overdue",
        data: [1, 1, 2, 3, 3],
    },
];

const fontSize = "14px";

export default function TaskStatusChart() {
    const { theme } = useTheme();
    const [categories, setCategories] = useState<string[]>([]);
    const [series, SetSeries] = useState<ApexAxisChartSeries>([]);

    useEffect(() => {
        async function fetchData() {
            const res: ProjectTaskStatus = await fetch(
                `/api/manager/dashboard/analytics/task-status`
            ).then((res) => res.json());
            const newCategories = Object.keys(res);

            const inProgressData = [];
            const doneData = [];
            const canceledData = [];
            const notStartedYetData = [];
            const overdueData = [];
            for (const project of newCategories) {
                if (res[project]["In Progress"]) {
                    inProgressData.push(res[project]["In Progress"]);
                }
                if (res[project]["Done"]) {
                    doneData.push(res[project]["Done"]);
                }
                if (res[project]["Cancelled"]) {
                    canceledData.push(res[project]["Cancelled"]);
                }
                if (res[project]["Not Started Yet"]) {
                    notStartedYetData.push(res[project]["Not Started Yet"]);
                }
                if (res[project]["Overdue"]) {
                    overdueData.push(res[project]["Overdue"]);
                }
            }
            const newSeries = [];
            if (inProgressData.length > 0) {
                newSeries.push({ name: "In Progress", data: inProgressData });
            }
            if (doneData.length > 0) {
                newSeries.push({ name: "Done", data: doneData });
            }
            if (canceledData.length > 0) {
                newSeries.push({ name: "Canceled", data: canceledData });
            }
            if (notStartedYetData.length > 0) {
                newSeries.push({
                    name: "Not Started Yet",
                    data: notStartedYetData,
                });
            }
            if (overdueData.length > 0) {
                newSeries.push({ name: "Overdue", data: overdueData });
            }

            setCategories(newCategories);
            SetSeries(newSeries);
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
            stacked: true,
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
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: "40rem",
                borderRadius: 4,
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
            offsetX: 100,
        },
        theme: {
            palette: "palette6",
            mode: (theme as "dark" | "light") || "dark",
        },
        tooltip: {
            style: {
                fontSize: fontSize,
            },
        },
    };

    return (
        <ReactApexChart
            type="bar"
            options={options}
            series={series}
            height="96%"
        />
    );
}

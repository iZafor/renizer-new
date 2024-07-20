"use server";

import { db, parseToPlainObject, QueryResult } from "@/lib/db";
import {
    ProjectsOverviewData,
    ProjectsBasedOnEnergySource,
    ProjectTaskPerformance,
    ProjectTaskStatus,
    ProducedEnergyBasedOnEnergySource,
    InvestmentBasedOnEnergySource,
    ProducedEnergyPerYearBasedOnEnergySource,
} from "@/lib/definitions";

export async function getProjectsOverviewData(managerId: string) {
    try {
        const queryRes = await db
            .query<QueryResult[][]>(
                `
                SELECT COUNT(*) AS activeProjects
                FROM Project_T
                WHERE status NOT IN ('Not Started Yet', 'Cancelled', 'On Hold', 'Completed', 'Closed') AND m_p_user_id = '${managerId}';    

                SELECT COUNT(*) AS completedProjects
                FROM Project_T
                WHERE status = 'Completed' AND m_p_user_id = '${managerId}';

                SELECT COUNT(*) AS projectsInProgress 
                FROM Project_T
                WHERE status = 'In Progress' AND m_p_user_id = '${managerId}';

                SELECT COUNT(DISTINCT(a.project_id)) AS projectsInOverdue 
                FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
                WHERE a.status = 'Overdue' AND m_p_user_id = '${managerId}';
            `
            )
            .then((rows) => rows.map(parseToPlainObject));

        const res: ProjectsOverviewData = {
            activeProjects: queryRes[0][0].activeProjects,
            completedProjects: queryRes[1][0].completedProjects,
            projectsInProgress: queryRes[2][0].projectsInProgress,
            projectsInOverdue: queryRes[3][0].projectsInOverdue,
        };

        await db.end();
        return res;
    } catch (error) {
        console.error(error);
        return {
            activeProjects: -1,
            completedProjects: -1,
            projectsInProgress: -1,
            projectsInOverdue: -1,
        };
    }
}

export async function getProjectsBasedOnEnergySource(managerId: string) {
    try {
        const res = (await db
            .query<QueryResult[]>(
                `
            SELECT energy_source, COUNT(project_id) AS count
            FROM Project_T
            WHERE m_p_user_id = '${managerId}'
            GROUP BY energy_source;
            `
            )
            .then(parseToPlainObject)) as ProjectsBasedOnEnergySource[];
        await db.end();

        return res;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProducedEnergyBasedOnEnergySource(managerId: string) {
    try {
        const res = (await db
            .query<QueryResult[]>(
                `
            SELECT energy_source, SUM(b.produced_energy_wh) AS produced_wh
            FROM Project_T AS a INNER JOIN Project_Produced_Energy_Update_History_T AS b ON a.project_id = b.project_id
            WHERE m_p_user_id = '${managerId}'
            GROUP BY energy_source;
            `
            )
            .then(parseToPlainObject)) as ProducedEnergyBasedOnEnergySource[];
        await db.end();

        return res;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getInvestmentBasedOnEnergySource(managerId: string) {
    try {
        const res = (await db
            .query<QueryResult[]>(
                `
            SELECT energy_source, SUM(investment_amount) AS investment_received
            FROM Project_T AS a INNER JOIN Project_Investment_T AS b ON a.project_id = b.project_id
            WHERE m_p_user_id = '${managerId}' AND investment_date IS NOT NULL
            GROUP BY energy_source;
        `
            )
            .then(parseToPlainObject)) as InvestmentBasedOnEnergySource[];
        await db.end();

        return res;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProducedEnergyPerYearBasedOnEnergySource(
    managerId: string
) {
    try {
        const queryRes = await db
            .query<QueryResult[]>(
                `
            SELECT energy_source, YEAR(updated_on) AS year, SUM(b.produced_energy_wh) AS produced_wh
            FROM Project_T AS a INNER JOIN Project_Produced_Energy_Update_History_T AS b ON a.project_id = b.project_id
            WHERE m_p_user_id = '${managerId}'
            GROUP BY energy_source, year 
            ORDER BY year
            `
            )
            .then(parseToPlainObject);
        await db.end();

        const res = {} as ProducedEnergyPerYearBasedOnEnergySource;
        res["data"] = {};
        res["years"] = [];
        const years = queryRes.map((res) => res["year"]);
        for (const y of years) {
            if (!res["years"].includes(y)) {
                res["years"].push(y);
            }
        }
        for (const row of queryRes) {
            const source = res["data"][row["energy_source"]];
            if (source) {
                source[row["year"]] = row["produced_wh"];
            } else {
                res["data"][row["energy_source"]] = {
                    [row["year"]]: row["produced_wh"],
                };
            }
        }
        return res;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProjectsTaskPerformance(managerId: string) {
    try {
        const queryRes = await db
            .query<QueryResult[][]>(
                `
            SELECT b.name, COUNT(*) AS totalTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE b.m_p_user_id = '${managerId}'
            GROUP BY b.name;

            SELECT b.name, COUNT(DISTINCT(a.p_user_id)) AS contributors
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE b.m_p_user_id = '${managerId}'
            GROUP BY b.name;

            SELECT b.name, SUM(ABS(DATEDIFF(a.expected_delivery_date, a.delivery_date))) AS daysTaken
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE b.m_p_user_id = '${managerId}'
            GROUP BY b.name;
            `
            )
            .then((rows) => rows.map(parseToPlainObject));

        const res: ProjectTaskPerformance = {};
        for (const row of queryRes[0]) {
            const { name, totalTasks } = row as unknown as {
                name: string;
                totalTasks: number;
            };
            res[name] = { "Total Tasks": totalTasks };
        }
        for (const row of queryRes[1]) {
            const { name, contributors } = row as unknown as {
                name: string;
                contributors: number;
            };
            res[name]["Tasks Per Contributor"] =
                res[name]["Total Tasks"] / contributors;
        }
        for (const row of queryRes[2]) {
            const { name, daysTaken } = row as unknown as {
                name: string;
                daysTaken: number;
            };
            res[name]["Avg. Completion Day"] =
                res[name]["Total Tasks"] / daysTaken;
        }

        await db.end();
        return res;
    } catch (error) {
        console.error(error);
        return {};
    }
}

export async function getProjectTaskStatus(managerId: string) {
    try {
        const queryRes = await db
            .query<QueryResult[][]>(
                `
            SELECT b.name, COUNT(*) AS inProgressTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE a.status = 'In Progress' AND b.m_p_user_id = '${managerId}'
            GROUP BY b.name;

            SELECT b.name, COUNT(*) AS doneTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE a.status = 'Done' AND b.m_p_user_id = '${managerId}'
            GROUP BY b.name;

            SELECT b.name, COUNT(*) AS cancelledTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE a.status = 'Cancelled' AND b.m_p_user_id = '${managerId}'
            GROUP BY b.name;

            SELECT b.name, COUNT(*) AS notStartedYetTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE a.status = 'Not Started Yet' AND b.m_p_user_id = '${managerId}'
            GROUP BY b.name;

            SELECT b.name, COUNT(*) AS overdueTasks
            FROM Collaboration_Task_T AS a INNER JOIN Project_T AS b ON a.project_id = b.project_id
            WHERE a.status = 'Overdue' AND b.m_p_user_id = '${managerId}'
            GROUP BY b.name;
            `
            )
            .then((rows) => rows.map(parseToPlainObject));

        const res: ProjectTaskStatus = {};
        for (const row of queryRes[0]) {
            const { name, inProgressTasks } = row as unknown as {
                name: string;
                inProgressTasks: number;
            };
            res[name] = { "In Progress": inProgressTasks };
        }

        for (const row of queryRes[1]) {
            const { name, doneTasks } = row as unknown as {
                name: string;
                doneTasks: number;
            };
            res[name]["Done"] = doneTasks;
        }

        for (const row of queryRes[2]) {
            const { name, cancelledTasks } = row as unknown as {
                name: string;
                cancelledTasks: number;
            };
            res[name]["Cancelled"] = cancelledTasks;
        }

        for (const row of queryRes[3]) {
            const { name, notStartedYetTasks } = row as unknown as {
                name: string;
                notStartedYetTasks: number;
            };
            res[name]["Not Started Yet"] = notStartedYetTasks;
        }

        for (const row of queryRes[4]) {
            const { name, overdueTasks } = row as unknown as {
                name: string;
                overdueTasks: number;
            };
            res[name]["Overdue"] = overdueTasks;
        }

        await db.end();
        return res;
    } catch (error) {
        console.error(error);
        return {};
    }
}

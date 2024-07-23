import { z } from "zod";
import {
    Project,
    ProjectCollaboration,
    ProjectInvestment,
    ProjectTask,
} from "@/lib/definitions";

export type NewProjectFromState =
    | {
          errors?: {
              name?: string[];
              energySource?: string[];
              description?: string[];
              managerId?: string[];
          };
          message?: string;
          newProject?: Project;
      }
    | undefined;

export const NewProjectFormSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Project name cannot be empty.",
        })
        .default(""),
    energySource: z
        .string()
        .min(1, { message: "Energy source cannot be empty." }),
    description: z.string().default("").optional(),
    managerId: z.string().uuid({ message: "Invalid form data." }),
    restrictedToOrganization: z.boolean().optional(),
});

export type ProjectMonoStateUpdateFormState =
    | {
          errors?: {
              value?: string[];
              projectId?: string[];
          };
          message?: string;
          updatedValue?: unknown;
      }
    | undefined;

export const UpdateCurrentEnergyRateFormSchema = z.object({
    value: z.number({ message: "Expected number." }).gt(0, {
        message: "Energy rate must be greater than 0.",
    }),
    projectId: z.string().uuid({ message: "Invalid form data." }),
});

export const UpdateProducedEnergyFormSchema = z.object({
    value: z.number({ message: "Expected number." }).gt(0, {
        message: "Produced energy must be greater than 0.",
    }),
    projectId: z.string().uuid({ message: "Invalid form data." }),
});

export const UpdateSoldEnergyFormSchema = z.object({
    value: z.number({ message: "Expected number." }).gt(0, {
        message: "Sold energy must be greater than 0.",
    }),
    projectId: z.string().uuid({ message: "Invalid form data." }),
});

export type InvestmentProposalFormState =
    | {
          errors?: {
              projectId?: string[];
              investor?: string[];
              amount?: string[];
          };
          message?: string;
          newInvestment?: ProjectInvestment;
      }
    | undefined;

export const InvestmentProposalFormSchema = z.object({
    projectId: z.string().uuid({ message: "Invalid form data." }),
    investor: z.string().uuid({
        message: "Investor must be selected.",
    }),
    amount: z.number().gt(0, {
        message: "Amount must be greater than 0.",
    }),
});

export type NewCollaboratorFormState =
    | {
          errors?: {
              projectId?: string[];
              contributor?: string[];
              role?: string[];
          };
          message?: string;
          newCollaboration?: ProjectCollaboration;
      }
    | undefined;

export const NewCollaboratorFormSchema = z.object({
    projectId: z.string().uuid({ message: "Invalid form data." }),
    contributor: z.string().uuid({
        message: "Contributor must be selected.",
    }),
    role: z.string().min(1, {
        message: "Role cannot be empty.",
    }),
});

export type NewExpectedDeliveryDateFormState =
    | {
          errors?: {
              cpUserId?: string[];
              projectId?: string[];
              taskName?: string;
              assignedDate?: string[];
              newExpectedDeliveryDate?: string[];
          };
          message?: string[];
          newExpectedDeliveryDate?: string;
      }
    | undefined;

export const NewExpectedDeliveryDateFormSchema = z.object({
    projectId: z.string().uuid({ message: "Invalid form data." }),
    cpUserId: z.string().uuid({ message: "Invalid form data." }),
    assignedDate: z.date({ message: "Invalid form data." }),
    taskName: z.string().min(1, { message: "Invalid form data." }),
    newExpectedDeliveryDate: z.date({ message: "Invalid date format." }),
});

export type NewTaskStatusFormState =
    | {
          errors?: {
              cpUserId?: string[];
              projectId?: string[];
              taskName?: string;
              assignedDate?: string[];
              newStatus?: string[];
          };
          message?: string[];
          newStatus?: string;
          deliveryDate?: string;
      }
    | undefined;

export const NewTaskStatusFormSchema = z.object({
    projectId: z.string().uuid({ message: "Invalid form data." }),
    cpUserId: z.string().uuid({ message: "Invalid form data." }),
    assignedDate: z.date({ message: "Invalid form data." }),
    taskName: z.string().min(1, { message: "Invalid form data." }),
    newStatus: z.enum(
        [
            "In Progress",
            "Completed",
            "Cancelled",
            "Not Started Yet",
            "Overdue",
            "On Hold",
        ],
        {
            message: "Invalid status.",
        }
    ),
});

export type NewTaskPriorityFormState =
    | {
          errors?: {
              cpUserId?: string[];
              projectId?: string[];
              taskName?: string;
              assignedDate?: string[];
              newPriority?: string[];
          };
          message?: string[];
          newPriority?: string;
      }
    | undefined;

export const NewTaskPriorityFormSchema = z.object({
    projectId: z.string().uuid({ message: "Invalid form data." }),
    cpUserId: z.string().uuid({ message: "Invalid form data." }),
    assignedDate: z.date({ message: "Invalid form data." }),
    taskName: z.string().min(1, { message: "Invalid form data." }),
    newPriority: z.enum(["High", "Medium", "Low"], {
        message: "Invalid priority.",
    }),
});

export type NewTaskAssigneeFormState =
    | {
          errors?: {
              cpUserId?: string[];
              projectId?: string[];
              taskName?: string[];
              assignedDate?: string[];
              newAssigneeId?: string[];
          };
          message?: string[];
          newAssigneeId?: string;
          newAssigneeName?: string;
          newAssigneeRole?: string;
          newAssignedDate?: string;
      }
    | undefined;

export const NewTaskAssigneeFormSchema = z.object({
    projectId: z.string().uuid({ message: "Invalid form data." }),
    cpUserId: z.string().uuid({ message: "Invalid form data." }),
    assignedDate: z.date({ message: "Invalid form data." }),
    taskName: z.string().min(1, { message: "Invalid form data." }),
    newAssigneeId: z.string().uuid({ message: "Invalid assignee." }),
});

export type TaskAssignmentFormState =
    | {
          errors?: {
              projectId?: string[];
              cpUserId?: string[];
              taskName?: string[];
              assignedDate?: string[];
              expectedHour?: string[];
              expectedDeliveryDate?: string[];
              priority?: string[];
          };
          message?: string[];
          task?: ProjectTask;
      }
    | undefined;

export const TaskAssignmentFormSchema = z.object({
    projectId: z.string().uuid({ message: "Invalid form data." }),
    cpUserId: z.string().uuid({ message: "Invalid form data." }),
    taskName: z.string().min(1, { message: "Task name cannot be empty." }),
    assignedDate: z.date({ message: "Invalid form data." }),
    expectedHour: z
        .number()
        .min(0, { message: "Expected hours cannot be negative." }),
    expectedDeliveryDate: z.date({
        message: "Invalid expected delivery date.",
    }),
    priority: z.enum(["High", "Low", "Medium"], {
        message: "Invalid priority.",
    }),
});

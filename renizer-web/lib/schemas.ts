import { z } from "zod";
import {
    Project,
    ProjectCollaboration,
    ProjectInvestment,
} from "@/lib/definitions";

export type NewProjectFromState =
    | {
          errors?: {
              name?: string[];
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

import { z } from "zod";
import { Project } from "@/lib/definitions";

export type NewProjectFromState =
    | {
          errors?: {
              name?: string[];
              description?: string[];
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
    restrictedToOrganization: z.boolean().optional(),
});

export type MonoStateUpdateFormState =
    | {
          errors?: {
              value?: string[];
          };
          message?: string;
          updatedValue?: number;
      }
    | undefined;

export const UpdateProducedEnergyFormSchema = z.object({
    value: z
        .number()
        .min(0, {
            message: "Produced energy must be a positive value.",
        })
        .default(0),
});

export const UpdateSoldEnergyFormSchema = z.object({
    value: z
        .number()
        .min(0, {
            message: "Sold energy must be a positive value.",
        })
        .default(0),
});

export type InvestmentProposalFormState =
    | {
          errors?: {
              investor?: string[];
              amount?: string[];
          };
          message?: string;
      }
    | undefined;

export const InvestmentProposalFormSchema = z.object({
    investor: z.string().length(36, {
        message: "Investor must be selected."
    }),
    amount: z.number().min(1, {
        message: "Amount must be greater than 0."
    })
});

export type NewCollaboratorFormState =
    | {
          errors?: {
              contributor?: string[];
              role?: string[];
          };
          message?: string;
      }
    | undefined;

export const NewCollaboratorFormSchema = z.object({
    contributor: z.string().length(36, {
        message: "Contributor must be selected."
    }),
    role: z.number().min(1, {
        message: "Role cannot be empty."
    })
});
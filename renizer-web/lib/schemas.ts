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
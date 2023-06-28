import { z } from "zod";
import { projectIdSchema } from "./project";

export const hasPermissionToProjectSchema = projectIdSchema;

export const isCreatorOfProjectSchema = projectIdSchema;

export const getMyProfessionalRoleSchema = projectIdSchema;

export const deleteMyAccountSchema = projectIdSchema;

export const updateMyProfessionalRoleSchema = z
  .object({
    userProfessionalRole: z.enum([
      "ACCOUNTANT",
      "DOCUMENT_CONTROLLER",
      "FOREMAN",
      "PROJECT_ENGINEER",
      "PROJECT_MEMBER",
      "PROJECT_MANAGER",
      "PROJECT_DIRECTOR",
      "QUANTITY_SURVEYOR",
      "SITE_SUPERVISOR",
      "SITE_ENGINEER",
      "SITE_ADMIN",
    ]),
  })
  .merge(projectIdSchema);

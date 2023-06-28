import { z } from "zod";

const projectId = z.object({
  projectId: z.string().min(1, "A projectId is required"),
});

export const createBudgetSchema = z
  .object({
    description: z.string().trim().min(1, "A description is required"),
    expectedBudget: z
      .number({ invalid_type_error: "Budget must be a number" })
      .positive({ message: "Budget must be positive" }),
    costsIncurred: z
      .number({ invalid_type_error: "Budget must be a number" })
      .positive({ message: "Costs incurred must be positive" }),
  })
  .merge(projectId);

const budgetId = z.object({
  budgetId: z.string().min(1, "A budgetId is required"),
});

export const updateBudgetSchema = createBudgetSchema
  .omit({ projectId: true })
  .merge(budgetId);

export const getBudgetsSchema = z
  .object({
    searchKey: z.string(),
    pageSize: z.number().optional(),
    pageIndex: z.number(),
  })
  .merge(projectId);

export const deleteBudgetSchema = budgetId;
export const getBudgetSchema = deleteBudgetSchema;

export const getExpectedBudgetSumAndCostsIncurredSumSchema = projectId;

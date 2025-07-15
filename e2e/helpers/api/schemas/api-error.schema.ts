import { z as schema } from "zod";

export const ApiErrorSchema = schema.object({
  error: schema.string(),
  someWronglyExpectedField: schema.string(), // easter egg to fix after executing tests ^^
});

export type ApiError = schema.infer<typeof ApiErrorSchema>;

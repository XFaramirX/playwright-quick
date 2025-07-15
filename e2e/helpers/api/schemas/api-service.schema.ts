import { z as schema } from "zod";

export const ApiServiceResponseSchema = schema.object({
  author_name: schema.string(),
  body: schema.string(),
  created_at: schema.string(),
  expiration_datetime: schema.string(),
  id: schema.string(),
  updated_at: schema.string(),
  user_id: schema.string(),
});

export const ApiServiceResponseArraySchema = schema.array(ApiServiceResponseSchema);

export const ApiServiceDataCreateSchema = schema.object({
  body: schema.string(),
  expiration_datetime: schema.string(),
});

export const ApiServiceDataUserCreateSchema = schema.object({
  email: schema.string(),
  name: schema.string(),
  password: schema.string()
});

export type ApiServiceResponse = schema.infer<typeof ApiServiceResponseSchema>;
export type ApiServiceDataCreate = schema.infer<typeof ApiServiceDataCreateSchema>;
export type ApiServicesResponse = schema.infer<typeof ApiServiceResponseArraySchema>;
export type ApiServicesUserCreate = schema.infer<typeof ApiServiceDataUserCreateSchema>;

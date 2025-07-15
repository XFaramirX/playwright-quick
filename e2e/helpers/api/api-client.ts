import { BaseApiClient, RequestParams } from "./base-client";
import { FetchConfig, FetchResponse } from "./fetch-helper";
import {
  ApiCreateUserResponse,
  ApiCreateUserResponseSchema,
  ApiLogin,
  ApiLoginResponse,
  ApiLoginResponseSchema
} from "./schemas/api-auth.schema";
import {
  ApiServiceDataCreate,
  ApiServiceResponse,
  ApiServiceResponseSchema,
  ApiServicesUserCreate
} from "./schemas/api-service.schema";
import { APIRequestContext, expect } from "@playwright/test";
import { BASE_URL } from "../../../playwright.config";

export class ApiClient extends BaseApiClient {
  loginPath = "/api/login";
  servicePath = "/api/chirps";
  userServicePath = "/api/user/chirps";
  usersPath = "/api/users";

  async login(login: ApiLogin): Promise<ApiLoginResponse> {
    const response = await this.makeRequest(this.loginPath, {
      method: "POST",
      data: login,
    });

    expect(response.status).toBe(200);

    // Validate the response using zod
    const data = ApiLoginResponseSchema.parse(response.data);

    return data;
  }

  async authenticate(login: ApiLogin): Promise<void> {
    const data = await this.login(login);
    this.config.headers.Authorization = `Bearer ${data.token}`;
  }

  async createService(service: ApiServiceDataCreate): Promise<ApiServiceResponse> {
    const response = await this.makeRequest(this.servicePath, {
      method: "POST",
      data: service,
    });

    expect(response.status).toBe(201);

    const data = ApiServiceResponseSchema.parse(response.data);

    return data;
  }

  async getService(serviceId: string): Promise<ApiServiceResponse> {
    const response = await this.makeRequest(`${this.servicePath}/${serviceId}`, {
      method: "GET",
    });

    expect(response.status).toBe(200);

    const data = ApiServiceResponseSchema.parse(response.data);

    return data;
  }

  async rawRequest(
    path: string,
    options: RequestParams,
  ): Promise<FetchResponse<unknown>> {
    return this.makeRequest(path, options);
  }

  async createNewUser(serviceDataNewUser: ApiServicesUserCreate): Promise<ApiCreateUserResponse> {

    const response = await this.makeRequest(this.usersPath, {
      method: "POST",
      data: serviceDataNewUser,
    });
    console.log("DataRequest", JSON.stringify(serviceDataNewUser));

    console.log(response)
    expect(response.status).toBe(201);

    const data = ApiCreateUserResponseSchema.parse(response.data);
    return data;
  }
}

export function createApiClient(
  request: APIRequestContext,
  headers?: Record<string, string>,
): ApiClient {
  const config: FetchConfig = {
    baseURL: BASE_URL,
    headers: headers ?? {},
  };

  return new ApiClient(config, request);
}

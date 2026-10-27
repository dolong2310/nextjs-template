import {
  HTTP_METHOD,
  type AxiosConfig,
  type GatewayOptions,
  type GatewayParams,
} from "@/libs/api/http.type";
import { httpCore } from "@/libs/api/http-core";
import qs, { type StringifyOptions } from "query-string";

export class HttpClient {
  private static readonly METHODS_WITH_BODY = [
    HTTP_METHOD.POST,
    HTTP_METHOD.PUT,
    HTTP_METHOD.PATCH,
  ];

  public static get<T>(
    params: Omit<GatewayParams, "method" | "body">,
    options?: GatewayOptions,
  ): Promise<T> {
    const { baseUrl, endpoint, query } = params;
    return this.requestGateway<T>(
      {
        baseUrl,
        endpoint,
        method: HTTP_METHOD.GET,
        query,
      },
      options,
    );
  }

  public static post<T>(
    params: Omit<GatewayParams, "method" | "query">,
    options?: GatewayOptions,
  ): Promise<T> {
    const { baseUrl, endpoint, body } = params;
    return this.requestGateway<T>(
      {
        baseUrl,
        endpoint,
        method: HTTP_METHOD.POST,
        body,
      },
      options,
    );
  }

  public static put<T>(
    params: Omit<GatewayParams, "method" | "query">,
    options?: GatewayOptions,
  ): Promise<T> {
    const { baseUrl, endpoint, body } = params;
    return this.requestGateway<T>(
      {
        baseUrl,
        endpoint,
        method: HTTP_METHOD.PUT,
        body,
      },
      options,
    );
  }

  public static patch<T>(
    params: Omit<GatewayParams, "method" | "query">,
    options?: GatewayOptions,
  ): Promise<T> {
    const { baseUrl, endpoint, body } = params;
    return this.requestGateway<T>(
      {
        baseUrl,
        endpoint,
        method: HTTP_METHOD.PATCH,
        body,
      },
      options,
    );
  }

  public static delete<T>(
    params: Omit<GatewayParams, "method" | "body">,
    options?: GatewayOptions,
  ): Promise<T> {
    const { baseUrl, endpoint, query } = params;
    return this.requestGateway<T>(
      {
        baseUrl,
        endpoint,
        method: HTTP_METHOD.DELETE,
        query,
      },
      options,
    );
  }

  private static async requestGateway<T>(
    params: GatewayParams,
    options: GatewayOptions = {},
  ): Promise<T> {
    const { baseUrl, endpoint, method, body, query } = params;
    const {
      signal,
      credentials = false,
      timeout,
      disableEncodeQS,
      headers,
      skipAuth,
      skipErrorHandler,
      onUploadProgress,
      onDownloadProgress,
    } = options;

    const hasBody =
      body !== undefined && HttpClient.METHODS_WITH_BODY.includes(method);

    const config: AxiosConfig = {
      ...(baseUrl ? { baseURL: baseUrl } : {}),
      ...(timeout !== undefined ? { timeout } : {}),
      url: endpoint,
      method,
      data: hasBody ? body : undefined,
      withCredentials: credentials,
      signal,
      headers,
      skipAuth,
      skipErrorHandler,
      onUploadProgress,
      onDownloadProgress,
    };

    if (query) {
      const qsOptions: StringifyOptions = {
        skipNull: true,
        encode: !disableEncodeQS,
      };
      config.params = query;
      config.paramsSerializer = () => qs.stringify(query, qsOptions);
    }

    const response = await httpCore.request<T>(config);
    return response.data;
  }
}

import type {
  AxiosProgressEvent,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";

export enum HTTP_METHOD {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export interface GatewayParams {
  baseUrl?: string;
  endpoint: string;
  method: HTTP_METHOD;
  body?: unknown;
  query?: Record<string, unknown>;
}

export interface GatewayOptions {
  signal?: AbortSignal;
  credentials?: boolean;
  timeout?: number;
  disableEncodeQS?: boolean;
  headers?: Record<string, string>;
  /** Bỏ qua gắn Authorization header, dùng cho public endpoint (login, register...) */
  skipAuth?: boolean;
  /** Bỏ qua interceptor xử lý lỗi tập trung (toast/redirect), để component tự catch */
  skipErrorHandler?: boolean;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

type CompoundConfig = {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
  /** Đánh dấu request đã retry sau refresh token, tránh loop vô hạn */
  _retry?: boolean;
};

export type AxiosConfig = AxiosRequestConfig & CompoundConfig;
export type InternalAxiosConfig = InternalAxiosRequestConfig & CompoundConfig;

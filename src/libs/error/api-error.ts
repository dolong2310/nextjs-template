import type { AxiosError } from "axios";
import { get } from "lodash-es";

export class ApiError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly data?: unknown;
  public readonly isNetworkError: boolean;

  constructor(error: AxiosError | Error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data;
    const message =
      get(data, "message") || get(error, "message", "Unknown error");
    super(message);

    this.status = get(axiosError, "response.status", 500);
    this.code = get(data, "code") ?? get(axiosError, "code", "UNKNOWN_ERROR");
    this.data = data ?? null;
    this.isNetworkError = !axiosError.response;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isValidationError(): boolean {
    return this.status === 422 || this.status === 400;
  }

  get isServerError(): boolean {
    return !!this.status && this.status >= 500;
  }
}

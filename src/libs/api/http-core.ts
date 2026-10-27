import { envConfig } from "@/config/env.config";
import type {
  AxiosConfig,
  InternalAxiosConfig,
} from "@/libs/api/http.type";
import { getAuthHandlers } from "@/libs/api/auth-handlers";
import { ApiError } from "@/libs/error/api-error";
import { generateId } from "@/utils/uuid.util";
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";

export class HttpCore {
  private readonly client: AxiosInstance;

  /**
   * Promise của lần refresh token đang chạy.
   *
   * - null: hiện không refresh token.
   * - Promise<string>: đang refresh; kết quả Promise là access token mới.
   *
   * Khi nhiều request cùng nhận 401, request đầu tiên tạo Promise này.
   * Các request sau dùng lại cùng Promise nên chỉ có một API refresh được gọi.
   */
  private refreshPromise: Promise<string> | null = null;

  public constructor() {
    this.client = axios.create({
      baseURL: envConfig.apiUrl,
      timeout: 30_000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  public request<T>(config: AxiosConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosConfig): InternalAxiosConfig => {
        // Handler được đăng ký từ auth store ở bên ngoài HttpClient.
        // Gọi getter ở thời điểm request giúp luôn lấy token mới nhất.
        const { getAccessToken } = getAuthHandlers();

        // Public endpoint có skipAuth=true sẽ không được gắn token.
        // Header Authorization có sẵn cũng được giữ nguyên, đặc biệt là
        // request retry đã được gắn token mới trong retryRequest().
        if (!config.skipAuth && !config.headers.has("Authorization")) {
          const token = getAccessToken();

          if (token) {
            config.headers.set("Authorization", `Bearer ${token}`);
          }
        }

        // Xoá Content-Type mặc định là "application/json" để tránh lỗi upload.
        // Browser/Axios tự động thêm "multipart/form-data" boundary.
        if (config.data instanceof FormData) {
          config.headers.delete("Content-Type");
          // config.headers.set("Content-Type", "multipart/form-data");
        }

        // ID riêng cho từng request để đối chiếu log frontend với backend.
        // config.headers.set("X-Request-Id", generateId());

        return config;
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError): Promise<AxiosResponse> => {
        // Axios lưu config của request thất bại trong error.config.
        // Cần config này để kiểm tra flag và gửi lại chính request đó.
        const originalRequest = error.config as AxiosConfig | undefined;

        // Không có config nghĩa là lỗi xảy ra trước khi Axios tạo request.
        // skipErrorHandler cho phép caller tự xử lý, không refresh/retry ở đây.
        if (!originalRequest || originalRequest.skipErrorHandler) {
          throw new ApiError(error);
        }

        // Không đủ điều kiện refresh: nếu là 401 thì kết thúc session,
        // sau đó chuẩn hóa AxiosError thành ApiError cho toàn ứng dụng.
        if (!this.canRefresh(error, originalRequest)) {
          if (error.response?.status === 401) {
            this.notifyUnauthorized();
          }

          throw new ApiError(error);
        }

        let newToken: string;

        // Tất cả request 401 đồng thời sẽ await cùng một refreshPromise.
        try {
          newToken = await this.refreshTokenOnce();
        } catch {
          throw new ApiError(error);
        }

        // Refresh access token thành công: gửi lại request cũ với access token mới.
        return this.retryRequest(originalRequest, newToken);
      },
    );
  }

  /**
   * Chỉ cho phép refresh khi đồng thời thỏa bốn điều kiện:
   * 1. Server trả 401.
   * 2. Đây không phải public request (skipAuth).
   * 3. Request chưa từng retry, tránh vòng lặp 401 -> refresh vô hạn.
   * 4. Ứng dụng đã đăng ký hàm refreshAccessToken.
   */
  private canRefresh(error: AxiosError, request: AxiosConfig): boolean {
    const { refreshAccessToken } = getAuthHandlers();

    return (
      error.response?.status === 401 &&
      !request.skipAuth &&
      !request._retry &&
      Boolean(refreshAccessToken)
    );
  }

  /**
   * Trả về access token mới nhưng chỉ tạo một refresh request tại một thời điểm.
   *
   * Ví dụ A, B, C cùng lỗi 401:
   * - A thấy refreshPromise=null nên gọi refreshAccessToken() và lưu Promise P.
   * - B và C thấy refreshPromise=P nên chỉ return/await P.
   * - P thành công: cả A, B, C nhận cùng token rồi tự retry request của mình.
   * - finally đặt lại null để lần hết hạn token sau có thể tạo refresh mới.
   */
  private refreshTokenOnce(): Promise<string> {
    if (!this.refreshPromise) {
      const { refreshAccessToken, onUnauthorized } = getAuthHandlers();

      if (!refreshAccessToken) {
        return Promise.reject(
          new Error("Refresh token handler is not registered"),
        );
      }

      this.refreshPromise = refreshAccessToken()
        .catch((error: unknown) => {
          // catch thuộc Promise dùng chung nên chỉ chạy một lần, dù có nhiều
          // request đang await. Vì vậy logout/redirect cũng chỉ chạy một lần.
          onUnauthorized?.();
          throw error;
        })
        .finally(() => {
          // Xóa Promise đã hoàn tất; không giữ token hoặc Promise cũ mãi mãi.
          this.refreshPromise = null;
        });
    }

    // Có thể là Promise vừa tạo hoặc Promise đang được request khác sử dụng.
    return this.refreshPromise;
  }

  /** Gắn token mới và gửi lại đúng request đã nhận 401. */
  private retryRequest(
    request: AxiosConfig,
    token: string,
  ): Promise<AxiosResponse> {
    // Nếu request retry tiếp tục nhận 401, canRefresh() sẽ trả false.
    request._retry = true;
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    };

    return this.client.request(request);
  }

  /** Báo cho auth layer xóa session/redirect về login page. */
  private notifyUnauthorized(): void {
    getAuthHandlers().onUnauthorized?.();
  }
}

export const httpCore = new HttpCore();

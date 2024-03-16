import axios, { AxiosInstance, AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

class RequestError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public response?: AxiosResponse
  ) {
    super((response && response.config ? response.config.url : "") + message);
  }

  isApiException = true;
}

interface RecommendedFees {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

export class MempoolApi {
  private axios: AxiosInstance;

  constructor(params: { baseUrl: string }) {
    this.axios = axios.create({
      baseURL: params.baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    this.axios.interceptors.response.use(
      (async (
        response: AxiosResponse<{
          code: number;
          msg: string;
          data: any;
        }>
      ) => {
        const res = response.data;
        return res;
      }) as any,
      (error) => {
        if (error.status == 400) {
          return Promise.reject(error.response.data);
        }
        if (error.response) {
          return Promise.reject(
            new RequestError(
              error.response.data,
              error.response.status,
              error.response
            )
          );
        }

        if (error.isAxiosError) {
          return Promise.reject(new RequestError("noInternetConnection"));
        }
        return Promise.reject(error);
      }
    );
  }

  async getRecommendFee() {
    const response = await this.axios.get<null, RecommendedFees>(
      "/v1/fees/recommended",
      {}
    );
    return response;
  }

  async getRawTx(txid: string) {
    const response = await this.axios.get<null, string>(`/tx/${txid}/hex`);
    return response;
  }
}

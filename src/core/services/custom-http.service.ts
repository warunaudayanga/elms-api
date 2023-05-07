// noinspection JSUnusedGlobalSymbols

import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosError, AxiosRequestConfig } from "axios";
import { take } from "rxjs";
import { LoggerService } from "./logger.service";

@Injectable()
export class CustomHttpService {
    constructor(private readonly httpService: HttpService) {}

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = this.httpService.get<T>(url, config).pipe(take(1));
            return await new Promise((resolve, reject) => {
                res.subscribe({
                    next: (response) => {
                        resolve(response.data);
                    },
                    error: (error: AxiosError) => {
                        reject(error);
                    },
                });
            });
        } catch (error) {
            this.throwException(error);
        }
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = this.httpService.post<T>(url, data, config).pipe(take(1));
            return await new Promise((resolve, reject) => {
                res.subscribe({
                    next: (response) => {
                        resolve(response.data);
                    },
                    error: (error: AxiosError) => {
                        reject(error);
                    },
                });
            });
        } catch (error) {
            this.throwException(error);
        }
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = this.httpService.put<T>(url, data, config).pipe(take(1));
            return await new Promise((resolve, reject) => {
                res.subscribe({
                    next: (response) => {
                        resolve(response.data);
                    },
                    error: (error: AxiosError) => {
                        reject(error);
                    },
                });
            });
        } catch (error) {
            this.throwException(error);
        }
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = this.httpService.patch<T>(url, data, config).pipe(take(1));
            return await new Promise((resolve, reject) => {
                res.subscribe({
                    next: (response) => {
                        resolve(response.data);
                    },
                    error: (error: AxiosError) => {
                        reject(error);
                    },
                });
            });
        } catch (error) {
            this.throwException(error);
        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = this.httpService.delete<T>(url, config).pipe(take(1));
            return await new Promise((resolve, reject) => {
                res.subscribe({
                    next: (response) => {
                        resolve(response.data);
                    },
                    error: (error: AxiosError) => {
                        reject(error);
                    },
                });
            });
        } catch (error) {
            this.throwException(error);
        }
    }

    throwException(error: AxiosError): void {
        LoggerService.error(error.response);
        switch (error.response?.status as HttpStatus) {
            case HttpStatus.BAD_REQUEST:
                throw new BadRequestException(error.response.data);
            case HttpStatus.UNAUTHORIZED:
                throw new UnauthorizedException(error.response.data);
            case HttpStatus.FORBIDDEN:
                throw new ForbiddenException(error.response.data);
            default:
                throw new HttpException(error.response?.data ?? error.response ?? error, error.response?.status ?? 500);
        }
    }
}

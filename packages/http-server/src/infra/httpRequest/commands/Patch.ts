import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Command } from "@pjore/common/types/Command";

export class PatchCommand<T> implements Command<T> {
    constructor(private endpoint: string, private payload:unknown, private config?: AxiosRequestConfig) {}

    public async execute(): Promise<T> {
        const result:AxiosResponse<T> = await axios.patch(
            this.endpoint,
            this.payload,
            this.config
        );
        if (result && result.data) {
            return result.data;
        }
        else {
            throw new Error(JSON.stringify(result));
        }
    }
}
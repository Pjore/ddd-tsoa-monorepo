import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Command } from "@pjore/common/types/Command";

export class GetCommand<T> implements Command<T> {
    constructor(private endpoint: string, private config?: AxiosRequestConfig) {}

    public async execute(): Promise<T> {
        const result:AxiosResponse<T> = await axios.get(
            this.endpoint,
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
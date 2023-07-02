import { connect, ConnectOptions } from "mongoose";

export async function connectToDB(url: string) {
    let options: ConnectOptions = {
    };

    try {
        await connect(url, options);
    }
    catch(err) {
        console.log(`Mongoose error: ${err}`)
    }
}
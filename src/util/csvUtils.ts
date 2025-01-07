import { ZodSchema } from "zod";
import fs from "fs";
import Papa from "papaparse";
import _ from "lodash";
import { CustomError } from "./customError";

export class CsvUtils {
    public static readFile<T>(
        filePath: string,
        schema: ZodSchema<T>
    ): Promise<T[]> {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(filePath)) {
                reject(new CustomError("File not found", 404));
                return;
            }
            const data: T[] = [];
            Papa.parse(fs.readFileSync(filePath, "utf-8"), {
                header: true,
                dynamicTyping: true,
                step: (row) => {
                    const parsedRow = schema.safeParse(row.data);
                    if (parsedRow.success) {
                        data.push(parsedRow.data);
                    } else {
                        console.error(
                            `Row parsing failed on row ${JSON.stringify(
                                row.data
                            )}. Error: ${parsedRow.error}`
                        );
                    }
                },
                complete: () => {
                    resolve(data);
                },
                error: (error: any) => {
                    reject(new CustomError(error.message, 400));
                },
            });
        });
    }

    public static joinByKey<T, U, K1 extends keyof T, K2 extends keyof U>(
        object1: T[],
        object2: U[],
        key1: K1,
        key2: K2
    ): (T & U)[] {
        const lookup = new Map<T[K1], U>();

        object2.forEach((item) => {
            lookup.set(item[key2] as unknown as T[K1], item);
        });

        return object1.map((item1) => {
            const item2 = lookup.get(item1[key1]) as U;
            return {
                ...item1,
                ...item2,
            };
        });
    }
}

import { ZodSchema } from "zod";
import fs from "fs";
import Papa from "papaparse";
import _ from "lodash";
import { ErrorReadingFile } from "../customErrors/ErrorReadingFile";

export class CsvUtils {
    public static readFile<T>(
        filePath: string,
        schema: ZodSchema<T>
    ): Promise<T[]> {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(filePath)) {
                reject(new ErrorReadingFile("File not found", 404));
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
                            `Row parsing failed: ${
                                parsedRow.error
                            }, Row: ${JSON.stringify(row.data)}`
                        );
                    }
                },
                complete: () => {
                    resolve(data);
                },
                error: (error: any) => {
                    reject(new ErrorReadingFile(error.message, 400));
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
        const map1 = _.keyBy(object1, key1 as string);
        const map2 = _.keyBy(object2, key2 as string);

        return _.values(map1)
            .filter((val: T) => map2[val[key1] as string])
            .map((obj1: T) => ({
                ...obj1,
                ...map2[obj1[key1] as string],
            }));
    }
}

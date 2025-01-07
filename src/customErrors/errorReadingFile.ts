export class ErrorReadingFile extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = "ErrorReadingFile";
        this.statusCode = statusCode;
    }
}

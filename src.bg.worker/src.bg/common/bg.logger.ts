/* eslint-disable no-console */

export class BgLogger {
    
    private static _instance: BgLogger = null;

    private constructor() {
    }

    public static instance(): BgLogger {
        return this._instance || (this._instance = new this());
    }
    
    public log = (message: string): void => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const dateTime = new Date().toISOString();
        const temp_str = dateTime + '> ' + message;
        console.log(' ');
        console.log(temp_str);
    };
    
    public error = (message: string, code: number, details: unknown): void => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const dateTime = new Date().toISOString();
        const err = {
            message : message,
            code    : code,
            details : details
        };
        const temp_str = dateTime + '> ' + JSON.stringify(err, null, '    ');
        console.log(' ');
        console.log(temp_str);
    };

}

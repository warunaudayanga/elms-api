// noinspection JSUnusedGlobalSymbols

export const getValueFromCookie = (name: string, cookie: string): string => {
    let ca: Array<string> = cookie.split(";");
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
        c = ca[i].replace(/^\s+/g, "");
        if (c.indexOf(cookieName) === 0) {
            return c.substring(cookieName.length, c.length);
        }
    }
    return "";
};

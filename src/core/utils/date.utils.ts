// noinspection JSUnusedGlobalSymbols

import * as moment from "moment";

export const now = (format?: string): string => {
    return moment().format(format);
};

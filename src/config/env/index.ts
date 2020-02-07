import * as _ from "lodash";
import { commonConfig } from "./common";
import { developmentConfig } from "./development";
import { productionConfig } from "./production";

export function getConfig() {

    const config = process.env.CONFIG ? JSON.parse(process.env.CONFIG) : {};

    switch (process.env.NODE_ENV) {
        case "development":
            return _.merge(commonConfig, developmentConfig, config);
        case "production":
            return _.merge(commonConfig, productionConfig, config);
        default:
            return commonConfig;
    }

}

import * as _                from "lodash";
import { commonConfig }      from "./common";
import { developmentConfig } from "./development";
import { productionConfig }  from "./production";

export function getConfig() {

    switch (process.env.NODE_ENV) {
        case "development":
            return _.merge(commonConfig, developmentConfig);
        case "production":
            return _.merge(commonConfig, productionConfig);
        default:
            return commonConfig;
    }

}

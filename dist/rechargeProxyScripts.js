"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberOfSubscriptions = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const { SQUATCH_RECHARGE_PROXY_API_KEY, SQUATCH_RECHARGE_PROXY_API_BASE_URL, } = process.env;
const getNumberOfSubscriptionsInternal = (shopifyOrder) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, axios_1.default)({
        method: 'get',
        url: `${SQUATCH_RECHARGE_PROXY_API_BASE_URL}/customer?email=${shopifyOrder.email}`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'x-api-key': SQUATCH_RECHARGE_PROXY_API_KEY,
        },
    });
    if (!data) {
        return {
            active: -1,
            total: -1,
        };
    }
    return {
        active: data.subscriptions_active_count,
        total: data.subscriptions_total_count,
    };
});
const getNumberOfSubscriptions = (shopifyOrder) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, utils_1.exponentialBackoff)(getNumberOfSubscriptionsInternal, [shopifyOrder], { funcName: 'getNumberOfSubscriptions' });
});
exports.getNumberOfSubscriptions = getNumberOfSubscriptions;

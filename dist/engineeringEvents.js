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
exports.EngineeringEvents = exports.eventTracker = exports.determineSourceType = void 0;
/* eslint-disable no-empty */
const axios_1 = __importDefault(require("axios"));
const { ENGINEERING_EVENTS_URL_PROD, ENGINEERING_EVENTS_URL_FALLBACK, } = process.env;
const determineSourceType = (obj) => {
    let sourceType = 'unknown';
    try {
        const charge = obj;
        if (charge.note.includes('next order in sequence')) {
            sourceType = 'rechargeCharge';
        }
    }
    catch (_a) { }
    try {
        const rechargeOrder = obj;
        if (rechargeOrder.charge.id) {
            sourceType = 'rechargeOrder';
        }
    }
    catch (_b) { }
    try {
        const shopifyOrder = obj;
        if (shopifyOrder.admin_graphql_api_id) {
            sourceType = 'shopifyOrder';
        }
    }
    catch (_c) { }
    try {
        const narvarPayload = obj;
        if (narvarPayload.narvar_tracer_id !== undefined) {
            sourceType = 'narvarPayload';
        }
    }
    catch (_d) { }
    try {
        const shopifyFeeds = obj;
        if (shopifyFeeds.shopifyFeeds) {
            sourceType = 'shopifyFeeds';
        }
    }
    catch (_e) { }
    return sourceType;
};
exports.determineSourceType = determineSourceType;
const eventTracker = (obj, eventName, message, props) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = obj.id || ''; // if this is empty, might be telling of a bug later on
    const sortKey = new Date().toISOString();
    const remainingProps = Object.assign({ message }, props);
    for (const [key, val] of Object.entries(remainingProps)) {
        if (val === undefined) {
            // @ts-ignore
            delete remainingProps[key];
        }
    }
    const engineeringEvent = {
        uid,
        sortKey,
        eventName,
        sourceType: (0, exports.determineSourceType)(obj),
        remainingEventProps: Object.assign({}, remainingProps),
    };
    if (!ENGINEERING_EVENTS_URL_PROD || !ENGINEERING_EVENTS_URL_FALLBACK) {
        console.error('Engineering events URLs are falsey! Service will crash here!');
        console.debug('ENGINEERING_EVENTS_URL_PROD:', ENGINEERING_EVENTS_URL_PROD);
        console.debug('ENGINEERING_EVENTS_URL_FALLBACK:', ENGINEERING_EVENTS_URL_FALLBACK);
    }
    try {
        const result = yield axios_1.default.post(ENGINEERING_EVENTS_URL_PROD, engineeringEvent);
        if (result.status >= 300 || result.status < 200) {
            const msg = 'eventTracker, ENGINEERING_EVENTS_URL_PROD service seems to be down! Trying fallback service URL';
            console.error(msg);
            throw new Error(msg);
        }
    }
    catch (err) {
        console.error('eventTracker, err:', err.stack || err);
        const result = yield axios_1.default.post(ENGINEERING_EVENTS_URL_FALLBACK, engineeringEvent);
        if (result.status >= 300 || result.status < 200) {
            const msg = 'eventTracker, ENGINEERING_EVENTS_URL_FALLBACK service seems to be down! Throwing an error!';
            console.error(msg);
            throw new Error(msg);
        }
    }
});
exports.eventTracker = eventTracker;
/**
 * @description this class is for consuming the engineering-events service from
 * client code, be it back-end, or front-end.
 */
class EngineeringEvents {
    /**
     *
     * @param serviceName the name of the client service, such as 'remorse-period-transformer'
     * @param transformer any kind of property transformer to be run on any extra col names
     * passed in as props
     */
    constructor(serviceName, transformer) {
        this.sendCriticalErrorEvent = (obj, props) => (0, exports.eventTracker)(obj, 'critical_error', undefined, this.transformer(Object.assign(Object.assign({}, props), { serviceName: this.serviceName })));
        this.sendProcessingBeginEvent = (obj, props) => (0, exports.eventTracker)(obj, 'processing_begin', undefined, this.transformer(Object.assign(Object.assign({}, props), { serviceName: this.serviceName })));
        this.sendProcessingCompleteEvent = (obj, props) => (0, exports.eventTracker)(obj, 'processing_complete', undefined, this.transformer(Object.assign(Object.assign({}, props), { serviceName: this.serviceName })));
        this.serviceName = serviceName;
        this.transformer = transformer || ((props) => props);
    }
}
exports.EngineeringEvents = EngineeringEvents;

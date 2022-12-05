/**
 * @description This file is for 'building' the JSON flat-file data for this
 * library to depend on, but within the consuming/client code.
 *
 * This building phase should be run pre-build/bundle of the consuming/client code.
 *
 * @note the bundler in consuming/client code must know to keep/bundle these flat files.
 */
export declare const generateContent: () => Promise<void>;

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as dayCapture from "../dayCapture.js";
import type * as dayCaptureActions from "../dayCaptureActions.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_dayCapture from "../lib/dayCapture.js";
import type * as lib_dayCaptureDb from "../lib/dayCaptureDb.js";
import type * as lib_dayCaptureSynthesis from "../lib/dayCaptureSynthesis.js";
import type * as logEntries from "../logEntries.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  dayCapture: typeof dayCapture;
  dayCaptureActions: typeof dayCaptureActions;
  "lib/auth": typeof lib_auth;
  "lib/dayCapture": typeof lib_dayCapture;
  "lib/dayCaptureDb": typeof lib_dayCaptureDb;
  "lib/dayCaptureSynthesis": typeof lib_dayCaptureSynthesis;
  logEntries: typeof logEntries;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

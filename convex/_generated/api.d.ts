/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as config from "../config.js";
import type * as files from "../files.js";
import type * as freepik from "../freepik.js";
import type * as http from "../http.js";
import type * as migrations_addLikeFields from "../migrations/addLikeFields.js";
import type * as podcasts from "../podcasts.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  config: typeof config;
  files: typeof files;
  freepik: typeof freepik;
  http: typeof http;
  "migrations/addLikeFields": typeof migrations_addLikeFields;
  podcasts: typeof podcasts;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */

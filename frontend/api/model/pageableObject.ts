/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import type { SortObject } from './sortObject';

export interface PageableObject {
  offset?: number;
  paged?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sort?: SortObject;
  unpaged?: boolean;
}
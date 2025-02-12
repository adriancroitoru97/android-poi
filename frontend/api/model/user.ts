/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import type { GrantedAuthority } from './grantedAuthority';
import type { Restaurant } from './restaurant';
import type { Preference } from './preference';
import type { UserRole } from './userRole';

export interface User {
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  authorities?: GrantedAuthority[];
  credentialsNonExpired?: boolean;
  email?: string;
  enabled?: boolean;
  firstName?: string;
  id?: number;
  lastName?: string;
  likedRestaurants?: Restaurant[];
  listOfPreference?: Preference[];
  password?: string;
  role?: UserRole;
  username?: string;
}

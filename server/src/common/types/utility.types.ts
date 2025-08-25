// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Id = number;
export type Email = string;
export type Brand = string;

// Database types
export type SortOrder = 'ASC' | 'DESC';
export type WhereCondition<T> = Partial<T> | any;

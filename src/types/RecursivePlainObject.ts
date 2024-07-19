type OmitMethodProperty<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

type OmitStartsWithUnderscore<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

type PlainObject<T> = OmitMethodProperty<OmitStartsWithUnderscore<T>>;

/**
 * 配列を除き、次のプロパティを無くした型を返す
 * - 関数のプロパティ
 * - `_`で始まるプロパティ
 */
export type RecursivePlainObject<T> = T extends (infer U)[]
  ? RecursivePlainObject<U>[]
  : T extends object
  ? { [K in keyof PlainObject<T>]: RecursivePlainObject<PlainObject<T>[K]> }
  : T;

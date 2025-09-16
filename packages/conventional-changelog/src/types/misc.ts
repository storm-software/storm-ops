export type ArrayElement<T> = T extends readonly unknown[] ? T[0] : never;

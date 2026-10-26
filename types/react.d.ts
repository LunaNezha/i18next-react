import "react";

declare module "react" {
  export function cache<Arguments extends unknown[], Result>(
    callback: (...args: Arguments) => Result,
  ): (...args: Arguments) => Result;
}

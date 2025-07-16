import { ComponentType } from "react";

export const lazyWrap = <T extends Record<string, unknown>>(
  factory: () => Promise<{ default: ComponentType<T> }>
) => {
  return async () => {
    const module = await factory();
    return { Component: module.default };
  };
};

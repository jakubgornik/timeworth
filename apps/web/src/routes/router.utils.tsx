import { ReactNode, ComponentType } from "react";

export const lazyWrap = <T extends Record<string, unknown>>(
  factory: () => Promise<{ default: ComponentType<T> }>,
  Guard?: ComponentType<{ children: ReactNode }>
) => {
  return async () => {
    const Component = (await factory()).default;

    const wrapped = Guard ? (
      <Guard>
        <Component {...({} as T)} />
      </Guard>
    ) : (
      <Component {...({} as T)} />
    );

    return { element: wrapped };
  };
};

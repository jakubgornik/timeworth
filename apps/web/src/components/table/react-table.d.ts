import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    width?: number;
    disablePadding?: boolean;
  }
}

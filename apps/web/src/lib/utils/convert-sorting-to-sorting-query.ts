import { SortingState } from "@tanstack/react-table";

interface SortingQuery {
  id: string;
  desc: boolean;
}

export const convertSortingToQuery = (
  sorting: SortingState
): SortingQuery | undefined => {
  if (sorting.length === 0) {
    return undefined;
  }

  return {
    id: sorting[0].id,
    desc: sorting[0].desc,
  };
};

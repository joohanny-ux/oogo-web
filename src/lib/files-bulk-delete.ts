export type BulkDeleteUnusedState = {
  ok: boolean;
  message: string;
  deleted?: number;
};

export const initialBulkDeleteUnusedState: BulkDeleteUnusedState = {
  ok: false,
  message: ""
};

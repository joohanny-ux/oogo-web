export type ProductSaveState = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

/** Keep outside "use server" modules so Next does not treat it as a server reference. */
export const initialProductSaveState: ProductSaveState = {
  ok: false,
  message: ""
};

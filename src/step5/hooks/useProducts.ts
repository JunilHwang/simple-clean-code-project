import { useShallowStore as useStore } from './useStore.ts';

export const useProductOptions = () =>
  useStore((state) => state.productOptions);

export const useFilteredProducts = () =>
  useStore((state) => state.getFilteredProducts());

export const useChangeProductOptions = () =>
  useStore((state) => state.changeProductOptions);

export const useProduct = (id: string) =>
  useStore((state) => state.products[id]);

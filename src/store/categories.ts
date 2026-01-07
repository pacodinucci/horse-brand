import { create } from "zustand";

export type NavbarCategory = {
  id: string;
  name: string;
  slug: string | null;
  subcategories: Array<{ id: string; name: string; slug: string | null }>;
};

type State = {
  categories: NavbarCategory[];
  loaded: boolean;
  setCategories: (cats: NavbarCategory[]) => void;
};

export const useCategoriesStore = create<State>((set) => ({
  categories: [],
  loaded: false,
  setCategories: (cats) => set({ categories: cats, loaded: true }),
}));

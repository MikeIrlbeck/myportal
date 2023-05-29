import { atom } from "jotai";
import type { activeDateFilter } from "../components/invoice/DateFilter";
import type { activeSearchFilter } from "../components/invoice/SearchFilter";

export const mutationCountAtom = atom(0);
export const activeSearchFiltersAtom = atom<activeSearchFilter[]>([]);
export const activeDateFiltersAtom = atom<activeDateFilter[]>([]);


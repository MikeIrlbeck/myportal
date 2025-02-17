import { atom } from "jotai";
import type { activeSearchFilter } from "../components/task/SearchFilter";
import type { activeStatusFilter } from "../components/task/StatusFilter";

export const tasksMutationCountAtom = atom(0);
export const activeStatusFiltersAtom = atom<activeStatusFilter[]>([]);
export const activeSearchFiltersAtom = atom<activeSearchFilter[]>([]);

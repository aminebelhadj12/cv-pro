import type { Locale } from "@/types/i18n";
import type {
  AccentId,
  ListItemMap,
  ListKey,
  PersonalInfo,
  ResumeData,
  TemplateId,
} from "@/types/resume";
import { createEmptyItem, createInitialResume } from "./defaults";

type UpdateItemAction = {
  [K in ListKey]: {
    type: "UPDATE_ITEM";
    key: K;
    id: string;
    patch: Partial<Omit<ListItemMap[K], "id">>;
  };
}[ListKey];

export type ResumeAction =
  | { type: "SET_PERSONAL"; field: keyof PersonalInfo; value: string }
  | { type: "SET_SUMMARY"; value: string }
  | { type: "SET_CV_LOCALE"; value: Locale }
  | { type: "SET_TEMPLATE"; value: TemplateId }
  | { type: "SET_ACCENT"; value: AccentId }
  | { type: "ADD_ITEM"; key: ListKey; id: string }
  | UpdateItemAction
  | { type: "REMOVE_ITEM"; key: ListKey; id: string }
  | { type: "MOVE_ITEM"; key: ListKey; id: string; direction: -1 | 1 }
  | { type: "LOAD"; data: ResumeData }
  | { type: "RESET" };

export function resumeReducer(
  state: ResumeData,
  action: ResumeAction,
): ResumeData {
  switch (action.type) {
    case "SET_PERSONAL":
      return {
        ...state,
        personal: { ...state.personal, [action.field]: action.value },
      };

    case "SET_SUMMARY":
      return { ...state, summary: action.value };

    case "SET_CV_LOCALE":
      return { ...state, cvLocale: action.value };

    case "SET_TEMPLATE":
      return { ...state, template: action.value };

    case "SET_ACCENT":
      return { ...state, accent: action.value };

    case "ADD_ITEM": {
      const list = state[action.key] as Array<{ id: string }>;
      if (list.some((item) => item.id === action.id)) return state;
      const item = createEmptyItem(action.key, action.id);
      return { ...state, [action.key]: [...list, item] } as ResumeData;
    }

    case "UPDATE_ITEM": {
      const list = state[action.key] as Array<{ id: string }>;
      return {
        ...state,
        [action.key]: list.map((item) =>
          item.id === action.id ? { ...item, ...action.patch } : item,
        ),
      } as ResumeData;
    }

    case "REMOVE_ITEM": {
      const list = state[action.key] as Array<{ id: string }>;
      return {
        ...state,
        [action.key]: list.filter((item) => item.id !== action.id),
      } as ResumeData;
    }

    case "MOVE_ITEM": {
      const list = [...(state[action.key] as Array<{ id: string }>)];
      const from = list.findIndex((item) => item.id === action.id);
      const to = from + action.direction;
      if (from < 0 || to < 0 || to >= list.length) return state;
      [list[from], list[to]] = [list[to], list[from]];
      return { ...state, [action.key]: list } as ResumeData;
    }

    case "LOAD":
      return action.data;

    case "RESET":
      return createInitialResume(state.cvLocale);

    default:
      return state;
  }
}

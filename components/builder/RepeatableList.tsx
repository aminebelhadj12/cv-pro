"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Button, IconButton } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { createId } from "@/lib/resume/id";
import { useResume } from "@/lib/resume/ResumeProvider";
import type { ListItemMap, ListKey } from "@/types/resume";

interface RepeatableListProps<K extends ListKey> {
  listKey: K;
  items: ListItemMap[K][];
  /** Title shown on each card (and used in button labels for screen readers). */
  getTitle: (item: ListItemMap[K], index: number) => string;
  renderFields: (item: ListItemMap[K], index: number) => ReactNode;
  /** "card": a titled card per item. "row": compact single row (skills, languages, links). */
  layout?: "card" | "row";
}

export function RepeatableList<K extends ListKey>({
  listKey,
  items,
  getTitle,
  renderFields,
  layout = "card",
}: RepeatableListProps<K>) {
  const { t } = useTranslation();
  const { dispatch } = useResume();
  const listRef = useRef<HTMLUListElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const pendingFocusId = useRef<string | null>(null);

  // After adding an item, move focus to its first text field.
  useEffect(() => {
    const id = pendingFocusId.current;
    if (!id) return;
    pendingFocusId.current = null;
    const target = listRef.current?.querySelector<HTMLElement>(
      `[data-item-id="${id}"] input:not([type="checkbox"]), [data-item-id="${id}"] textarea`,
    );
    target?.focus();
  }, [items]);

  const add = () => {
    const id = createId();
    pendingFocusId.current = id;
    dispatch({ type: "ADD_ITEM", key: listKey, id });
  };

  const move = (id: string, direction: -1 | 1) =>
    dispatch({ type: "MOVE_ITEM", key: listKey, id, direction });

  const remove = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", key: listKey, id });
    addRef.current?.focus();
  };

  const controls = (item: ListItemMap[K], index: number, title: string) => (
    <div className="flex shrink-0 items-center gap-0.5">
      <IconButton
        label={`${t.builder.actions.moveUp}: ${title}`}
        disabled={index === 0}
        onClick={() => move(item.id, -1)}
      >
        <ChevronUp aria-hidden="true" className="size-4" />
      </IconButton>
      <IconButton
        label={`${t.builder.actions.moveDown}: ${title}`}
        disabled={index === items.length - 1}
        onClick={() => move(item.id, 1)}
      >
        <ChevronDown aria-hidden="true" className="size-4" />
      </IconButton>
      <IconButton
        label={`${t.builder.actions.remove}: ${title}`}
        variant="danger"
        onClick={() => remove(item.id)}
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </IconButton>
    </div>
  );

  return (
    <div>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          {t.builder.empty[listKey]}
        </p>
      ) : (
        <ul
          ref={listRef}
          className={layout === "card" ? "space-y-4" : "space-y-3"}
        >
          {items.map((item, index) => {
            const title = getTitle(item, index);
            const headingId = `${listKey}-${item.id}-title`;

            if (layout === "row") {
              return (
                <li
                  key={item.id}
                  data-item-id={item.id}
                  className="flex items-start gap-2"
                >
                  <div
                    role="group"
                    aria-label={title}
                    className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2"
                  >
                    {renderFields(item, index)}
                  </div>
                  <div className="mt-[26px]">{controls(item, index, title)}</div>
                </li>
              );
            }

            return (
              <li
                key={item.id}
                data-item-id={item.id}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-4"
              >
                <div role="group" aria-labelledby={headingId}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3
                      id={headingId}
                      className="min-w-0 truncate text-sm font-semibold text-slate-800"
                    >
                      {title}
                    </h3>
                    {controls(item, index, title)}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {renderFields(item, index)}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Button ref={addRef} onClick={add} className="mt-4">
        <Plus aria-hidden="true" className="size-4" />
        {t.builder.actions.add[listKey]}
      </Button>
    </div>
  );
}

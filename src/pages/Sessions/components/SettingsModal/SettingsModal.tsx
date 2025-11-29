import { useEffect, useMemo, useState } from "react";
import { Button, Modal } from "@/components";
import type { SessionColumnVisibility } from "../../types";
import type { SessionsSettingsModalProps } from "./types";

const MIN_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

const SessionsSettingsModal = ({
  isOpen,
  onClose,
  pageSize,
  columns,
  columnVisibility,
  onApply,
}: SessionsSettingsModalProps) => {
  const [localPageSize, setLocalPageSize] = useState(pageSize);
  const [localVisibility, setLocalVisibility] = useState<SessionColumnVisibility>(columnVisibility);

  useEffect(() => {
    if (isOpen) {
      setLocalPageSize(pageSize);
      setLocalVisibility(columnVisibility);
    }
  }, [isOpen, pageSize, columnVisibility]);

  const visibleCount = useMemo(
    () => Object.values(localVisibility).filter(Boolean).length,
    [localVisibility]
  );

  const handleToggleColumn = (key: keyof SessionColumnVisibility, value: boolean) => {
    if (!value && visibleCount === 1 && localVisibility[key]) {
      return;
    }
    setLocalVisibility((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const boundedSize = Math.max(MIN_PAGE_SIZE, Math.min(MAX_PAGE_SIZE, localPageSize));
    onApply({
      pageSize: boundedSize,
      columnVisibility: localVisibility,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sessions settings"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            className="rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Pagination
          </p>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="number"
              min={MIN_PAGE_SIZE}
              max={MAX_PAGE_SIZE}
              step={5}
              value={localPageSize}
              onChange={(event) => {
                const next = Number(event.target.value);
                setLocalPageSize(Number.isNaN(next) ? MIN_PAGE_SIZE : next);
              }}
              className="w-24 rounded-xl border border-gray-200 bg-transparent p-2 text-center text-lg font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-50"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Records per page (min {MIN_PAGE_SIZE}, max {MAX_PAGE_SIZE})
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Columns
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {columns.map((column) => {
              const isChecked = localVisibility[column.key];
              const disableToggle = isChecked && visibleCount === 1;
              return (
                <label
                  key={column.key}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-400 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-500"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={isChecked}
                    onChange={(event) => handleToggleColumn(column.key, event.target.checked)}
                    disabled={disableToggle}
                  />
                  {column.label}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SessionsSettingsModal;

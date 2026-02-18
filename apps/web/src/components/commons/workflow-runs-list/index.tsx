"use client";

import { AlertDialog, Button, Chip, Skeleton } from "@repo/ui/heroui";
import { useRef, useState } from "react";
import type { WorkflowRunHistoryItem } from "#lib/types/workflow-history";
import { formatDate } from "#lib/utils/format-date";

interface WorkflowRunsTableProps {
  runs: WorkflowRunHistoryItem[];
  isLoading: boolean;
  errorMessage: string | null;
  isPending: boolean;
  onOpenRun: (run: WorkflowRunHistoryItem) => void;
  onDeleteRun: (runId: string) => void;
  totalCount: number;
  page: number;
  totalPages: number;
  search: string;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  showWorkflowLabel?: boolean;
  getWorkflowLabel?: (workflowKey: string) => string;
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

/* ── Search input ── */

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(newValue), 300);
  };

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/30"
        width={14}
        height={14}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <title>Buscar</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="search"
        placeholder="Buscar..."
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className="h-8 w-48 rounded-lg border border-default-200 bg-default-50 pl-8 pr-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}

/* ── Loading skeleton ── */

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-default-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-default-200 bg-default-50">
            {Array.from({ length: columns }).map((_, col) => (
              <th key={`col-${col}`} className="px-4 py-2.5">
                <Skeleton className="h-3 w-20 rounded-md" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((row) => (
            <tr key={row} className="border-b border-default-100 last:border-0">
              {Array.from({ length: columns }).map((_, cell) => (
                <td key={`cell-${cell}`} className="px-4 py-3">
                  <Skeleton
                    className={`h-4 rounded-md ${cell === 0 ? "w-3/4" : "w-1/2"}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Empty state ── */

function EmptyState({
  icon,
  title = "Sin ejecuciones",
  description = "No hay ejecuciones guardadas todavia.",
}: {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-default-100">
        {icon ?? (
          <svg
            className="text-foreground/25"
            width={28}
            height={28}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>No runs</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        )}
      </div>
      <p className="mb-1 text-sm font-medium text-foreground/60">{title}</p>
      <p className="max-w-xs text-xs text-foreground/40">{description}</p>
    </div>
  );
}

/* ── No results for search ── */

function NoResultsState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-default-100">
        <svg
          className="text-foreground/25"
          width={28}
          height={28}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <title>Sin resultados</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <p className="mb-1 text-sm font-medium text-foreground/60">
        Sin resultados para &ldquo;{search}&rdquo;
      </p>
      <p className="max-w-xs text-xs text-foreground/40">
        Intenta con otro termino de busqueda.
      </p>
    </div>
  );
}

/* ── Delete confirm dialog ── */

function DeleteConfirm({
  onConfirm,
  isPending,
}: {
  onConfirm: () => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog>
      <AlertDialog.Trigger>
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="shrink-0 rounded-lg p-1.5 text-foreground/30 transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-40"
        >
          <svg
            width={15}
            height={15}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Eliminar</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </AlertDialog.Trigger>

      {open && (
        <AlertDialog.Backdrop isDismissable>
          <AlertDialog.Container placement="center">
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Eliminar ejecucion</AlertDialog.Heading>
                <AlertDialog.CloseTrigger onPress={() => setOpen(false)} />
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p className="text-sm text-foreground/70">
                  Esta accion eliminara la ejecucion del historial. No se puede
                  deshacer.
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onPress={() => {
                    setOpen(false);
                    onConfirm();
                  }}
                >
                  Eliminar
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      )}
    </AlertDialog>
  );
}

/* ── Pagination ── */

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-2">
      <Button
        size="sm"
        variant="ghost"
        isDisabled={page <= 1}
        onPress={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>
      <span className="text-xs text-foreground/50 tabular-nums">
        Pagina {page} de {totalPages}
      </span>
      <Button
        size="sm"
        variant="ghost"
        isDisabled={page >= totalPages}
        onPress={() => onPageChange(page + 1)}
      >
        Siguiente
      </Button>
    </div>
  );
}

/* ── Main table ── */

export function WorkflowRunsTable({
  runs,
  isLoading,
  errorMessage,
  isPending,
  onOpenRun,
  onDeleteRun,
  totalCount,
  page,
  totalPages,
  search,
  onPageChange,
  onSearchChange,
  showWorkflowLabel = false,
  getWorkflowLabel,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: WorkflowRunsTableProps) {
  const columnCount = showWorkflowLabel ? 4 : 3;

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3">
        <p className="text-sm text-danger">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-foreground/40 tabular-nums">
          {!isLoading &&
            totalCount > 0 &&
            `${totalCount} resultado${totalCount !== 1 ? "s" : ""}`}
        </p>
        <SearchInput value={search} onChange={onSearchChange} />
      </div>

      {/* Table or states */}
      {isLoading ? (
        <TableSkeleton columns={columnCount} />
      ) : totalCount === 0 && !search ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : runs.length === 0 && search ? (
        <NoResultsState search={search} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-default-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default-200 bg-default-50">
                {showWorkflowLabel && (
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                    Workflow
                  </th>
                )}
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                  Descripcion
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                  Fecha
                </th>
                <th className="w-16 px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr
                  key={run.runId}
                  onClick={() => onOpenRun(run)}
                  className="cursor-pointer border-b border-default-100 transition-colors last:border-0 hover:bg-default-50"
                >
                  {showWorkflowLabel && (
                    <td className="px-4 py-3">
                      <Chip
                        variant="soft"
                        size="sm"
                        color="accent"
                        className="shrink-0"
                      >
                        {getWorkflowLabel?.(run.workflowKey) ?? run.workflowKey}
                      </Chip>
                    </td>
                  )}
                  <td className="max-w-xs truncate px-4 py-3 text-sm text-foreground">
                    {run.displayValue}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-foreground/50">
                    {formatDate(run.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteConfirm
                      onConfirm={() => onDeleteRun(run.runId)}
                      isPending={isPending}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

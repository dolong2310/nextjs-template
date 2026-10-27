"use client";

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { defaultFilter, useCommandState } from "cmdk";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/style.util";

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: string[];
}

interface ComboboxContextCommon {
  items: readonly ComboboxOption[];
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
}

type ComboboxContextValue = ComboboxContextCommon &
  (
    | {
        multiple: false;
        value: string;
        setValue: (value: string) => void;
      }
    | {
        multiple: true;
        value: string[];
        setValue: (value: string[]) => void;
        maxCount: number;
        maxSelectCount: number;
        showSelectAll: boolean;
        selectAllLabel: React.ReactNode;
      }
  );

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useComboboxContext(component: string) {
  const context = React.useContext(ComboboxContext);

  if (!context) {
    throw new Error(`${component} must be used within Combobox`);
  }

  return context;
}

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? value : internalValue;

  const setState = React.useCallback(
    (nextValue: T) => {
      if (Object.is(state, nextValue)) return;
      if (!isControlled) setInternalValue(nextValue);
      onChange?.(nextValue);
    },
    [isControlled, onChange, state],
  );

  return [state, setState] as const;
}

interface SharedComboboxProps {
  items: readonly ComboboxOption[];
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  modal?: boolean;
}

interface ComboboxMultipleOptions {
  maxCount?: number;
  maxSelectCount?: number;
  showSelectAll?: boolean;
  selectAllLabel?: React.ReactNode;
}

interface SingleComboboxProps extends SharedComboboxProps {
  multiple?: never;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface MultipleComboboxProps extends SharedComboboxProps {
  multiple: ComboboxMultipleOptions;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

type ComboboxProps = SingleComboboxProps | MultipleComboboxProps;

function Combobox(props: SingleComboboxProps): React.JSX.Element;
function Combobox(props: MultipleComboboxProps): React.JSX.Element;
function Combobox(props: ComboboxProps) {
  const {
    items,
    children,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    modal,
    multiple: multipleOptions,
    value: valueProp,
    defaultValue: defaultValueProp,
    onValueChange,
  } = props;
  const multiple = Boolean(multipleOptions);
  const maxCount = Math.max(1, Math.floor(multipleOptions?.maxCount ?? 3));
  const maxSelectCount =
    multipleOptions?.maxSelectCount === undefined ||
    multipleOptions.maxSelectCount === Infinity
      ? Infinity
      : Math.max(
          1,
          Math.floor(
            Number.isFinite(multipleOptions.maxSelectCount)
              ? multipleOptions.maxSelectCount
              : 1,
          ),
        );
  const showSelectAll = multipleOptions?.showSelectAll ?? false;
  const selectAllLabel = multipleOptions?.selectAllLabel ?? "Select all";
  const defaultValue = multiple
    ? (defaultValueProp ?? [])
    : (defaultValueProp ?? "");

  const handleValueChange = React.useCallback(
    (nextValue: string | string[]) => {
      if (multiple) {
        (onValueChange as MultipleComboboxProps["onValueChange"])?.(
          nextValue as string[],
        );
      } else {
        (onValueChange as SingleComboboxProps["onValueChange"])?.(
          nextValue as string,
        );
      }
    },
    [multiple, onValueChange],
  );

  const [value, setValue] = useControllableState<string | string[]>({
    value: valueProp,
    defaultValue,
    onChange: handleValueChange,
  });
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!disabled || !nextOpen) setOpen(nextOpen);
    },
    [disabled, setOpen],
  );

  const context = React.useMemo<ComboboxContextValue>(
    () =>
      multiple
        ? {
            items,
            multiple: true,
            value: value as string[],
            setValue: setValue as (value: string[]) => void,
            maxCount,
            maxSelectCount,
            showSelectAll,
            selectAllLabel,
            open,
            setOpen,
            disabled,
          }
        : {
            items,
            multiple: false,
            value: value as string,
            setValue: setValue as (value: string) => void,
            open,
            setOpen,
            disabled,
          },
    [
      disabled,
      items,
      maxCount,
      maxSelectCount,
      multiple,
      open,
      selectAllLabel,
      setOpen,
      setValue,
      showSelectAll,
      value,
    ],
  );

  return (
    <ComboboxContext.Provider value={context}>
      <Popover open={open} onOpenChange={handleOpenChange} modal={modal}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
}

type ComboboxTriggerProps = Omit<
  React.ComponentProps<typeof Button>,
  "children"
> & {
  placeholder?: React.ReactNode;
};

function ComboboxTrigger({
  className,
  placeholder = "Select an option...",
  disabled: triggerDisabled,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}: ComboboxTriggerProps) {
  const context = useComboboxContext("ComboboxTrigger");
  const selectedItems = context.multiple
    ? context.items.filter((item) => context.value.includes(item.value))
    : context.items.filter((item) => item.value === context.value);
  const allSelectedLabels = selectedItems.map((item) => item.label).join(", ");
  const visibleItems = context.multiple
    ? selectedItems.slice(0, context.maxCount)
    : selectedItems;
  const visibleLabels = visibleItems.map((item) => item.label).join(", ");
  const overflowCount = selectedItems.length - visibleItems.length;
  const computedAriaLabel =
    allSelectedLabels ||
    (typeof placeholder === "string" ? placeholder : undefined);

  return (
    <PopoverTrigger asChild>
      <Button
        type={type}
        variant="noShadow"
        role="combobox"
        aria-expanded={context.open}
        aria-label={
          ariaLabel ?? (context.multiple ? computedAriaLabel : undefined)
        }
        disabled={context.disabled || triggerDisabled}
        className={cn(
          "w-full min-w-0 max-w-[300px] justify-between",
          className,
        )}
        {...props}
      >
        {context.multiple ? (
          <span className="min-w-0 flex-1 truncate text-left">
            {visibleLabels || placeholder}
          </span>
        ) : (
          visibleLabels || placeholder
        )}
        {context.multiple && overflowCount > 0 && (
          <span className="shrink-0">+{overflowCount}</span>
        )}
        <ChevronsUpDown
          className={cn(context.multiple && "shrink-0 text-muted-foreground")}
        />
      </Button>
    </PopoverTrigger>
  );
}

type ComboboxContentProps = Omit<
  React.ComponentProps<typeof PopoverContent>,
  "children"
> & {
  children: React.ReactNode;
  commandClassName?: string;
};

function ComboboxContent({
  className,
  commandClassName,
  children,
  align,
  ...props
}: ComboboxContentProps) {
  const { multiple } = useComboboxContext("ComboboxContent");

  return (
    <PopoverContent
      align={align ?? (multiple ? "start" : "center")}
      className={cn(
        "w-(--radix-popover-trigger-width) border-0 p-0",
        className,
      )}
      {...props}
    >
      <Command
        className={cn(
          "**:data-[slot=command-input-wrapper]:h-11",
          commandClassName,
        )}
      >
        {children}
      </Command>
    </PopoverContent>
  );
}

function ComboboxInput(props: React.ComponentProps<typeof CommandInput>) {
  useComboboxContext("ComboboxInput");
  return <CommandInput {...props} />;
}

function ComboboxEmpty(props: React.ComponentProps<typeof CommandEmpty>) {
  useComboboxContext("ComboboxEmpty");
  return <CommandEmpty {...props} />;
}

function ComboboxCheckboxIndicator({ checked }: { checked: boolean }) {
  return (
    <div
      className="border-border pointer-events-none size-5 shrink-0 rounded-base border-2 transition-all select-none *:[svg]:opacity-0 data-[selected=true]:*:[svg]:opacity-100"
      data-selected={checked}
    >
      <CheckIcon className="size-4 text-current" />
    </div>
  );
}

const SELECT_ALL_VALUE = "__combobox_select_all__";

function ComboboxSelectAllItem() {
  const context = useComboboxContext("ComboboxSelectAllItem");
  const search = useCommandState((state) => state.search);

  if (!context.multiple || !context.showSelectAll) return null;

  const filteredEnabledItems = context.items
    .map((item, index) => ({
      item,
      index,
      score: search
        ? defaultFilter(item.value, search, [
            item.label,
            ...(item.keywords ?? []),
          ])
        : 1,
    }))
    .filter(({ item, score }) => !item.disabled && score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
  const filteredValues = filteredEnabledItems.map((item) => item.value);
  const filteredValueSet = new Set(filteredValues);
  const selectedCount = new Set(context.value).size;
  const remainingCapacity = Math.max(0, context.maxSelectCount - selectedCount);
  const filteredUnselectedValues = filteredValues.filter(
    (itemValue) => !context.value.includes(itemValue),
  );
  const valuesToAdd = filteredUnselectedValues.slice(0, remainingCapacity);
  const isAllFilteredSelected =
    filteredValues.length > 0 &&
    filteredValues.every((itemValue) => context.value.includes(itemValue));
  const disabled =
    context.disabled ||
    filteredValues.length === 0 ||
    (!isAllFilteredSelected && valuesToAdd.length === 0);

  return (
    <CommandItem
      forceMount
      value={SELECT_ALL_VALUE}
      disabled={disabled}
      onSelect={() => {
        if (disabled) return;

        context.setValue(
          isAllFilteredSelected
            ? context.value.filter(
                (itemValue) => !filteredValueSet.has(itemValue),
              )
            : [...context.value, ...valuesToAdd],
        );
      }}
    >
      <ComboboxCheckboxIndicator checked={isAllFilteredSelected} />
      {context.selectAllLabel}
    </CommandItem>
  );
}

type ComboboxListProps = Omit<
  React.ComponentProps<typeof CommandList>,
  "children"
> & {
  children?: React.ReactNode | ((item: ComboboxOption) => React.ReactNode);
};

function ComboboxList({ className, children, ...props }: ComboboxListProps) {
  const context = useComboboxContext("ComboboxList");
  const search = useCommandState((state) => state.search);
  const usesRenderFunction = typeof children === "function";
  const content = usesRenderFunction ? context.items.map(children) : children;

  return (
    <CommandList
      key={search ? "filtered" : "unfiltered"}
      className={cn(!context.multiple && "p-1", className)}
      {...props}
    >
      {context.multiple && context.showSelectAll && (
        <ComboboxGroup forceMount className="overflow-visible pb-0">
          <ComboboxSelectAllItem />
        </ComboboxGroup>
      )}
      {context.multiple && usesRenderFunction ? (
        <ComboboxGroup>{content}</ComboboxGroup>
      ) : (
        content
      )}
    </CommandList>
  );
}

function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandGroup>) {
  const { multiple } = useComboboxContext("ComboboxGroup");

  return (
    <CommandGroup
      className={cn(
        multiple &&
          "p-2 [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1",
        className,
      )}
      {...props}
    />
  );
}

type ComboboxItemProps = Omit<
  React.ComponentProps<typeof CommandItem>,
  "value" | "onSelect" | "disabled"
> & {
  value: string;
  textValue?: string;
  disabled?: boolean;
  onSelect?: React.ComponentProps<typeof CommandItem>["onSelect"];
};

function ComboboxItem({
  className,
  value,
  textValue,
  disabled: itemDisabled,
  onSelect,
  children,
  keywords,
  ...props
}: ComboboxItemProps) {
  const context = useComboboxContext("ComboboxItem");
  const option = context.items.find((item) => item.value === value);
  const selected = context.multiple
    ? context.value.includes(value)
    : context.value === value;
  const selectedCount = context.multiple
    ? new Set(context.value).size
    : selected
      ? 1
      : 0;
  const selectionLimitReached =
    context.multiple && selectedCount >= context.maxSelectCount;
  const disabled =
    context.disabled ||
    itemDisabled ||
    option?.disabled ||
    (selectionLimitReached && !selected);
  const searchKeywords = [
    option?.label,
    ...(option?.keywords ?? []),
    ...(keywords ?? []),
    textValue,
  ].filter((keyword): keyword is string => Boolean(keyword));

  return (
    <CommandItem
      value={value}
      keywords={searchKeywords}
      disabled={disabled}
      className={className}
      onSelect={(selectedValue) => {
        if (disabled) return;

        if (context.multiple) {
          context.setValue(
            selected
              ? context.value.filter((itemValue) => itemValue !== value)
              : [...context.value, value],
          );
        } else {
          context.setValue(selected ? "" : value);
          context.setOpen(false);
        }

        onSelect?.(selectedValue);
      }}
      {...props}
    >
      {context.multiple && <ComboboxCheckboxIndicator checked={selected} />}
      {children}
      {!context.multiple && (
        <CheckIcon
          className={cn("ml-auto", selected ? "opacity-100" : "opacity-0")}
        />
      )}
    </CommandItem>
  );
}

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
};
export type { ComboboxMultipleOptions, ComboboxOption, ComboboxProps };

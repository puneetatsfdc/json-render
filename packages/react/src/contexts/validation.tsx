"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import {
  runValidation,
  type ValidationConfig,
  type ValidationFunction,
  type ValidationResult,
} from "@json-render/core";
import { useStateStore } from "./state";

/**
 * Field validation state
 */
export interface FieldValidationState {
  /** Whether the field has been touched */
  touched: boolean;
  /** Whether the field has been validated */
  validated: boolean;
  /** Validation result */
  result: ValidationResult | null;
}

/**
 * Validation context value
 */
export interface ValidationContextValue {
  /** Custom validation functions from catalog */
  customFunctions: Record<string, ValidationFunction>;
  /** Validation state by field path */
  fieldStates: Record<string, FieldValidationState>;
  /** Validate a field */
  validate: (path: string, config: ValidationConfig) => ValidationResult;
  /** Mark field as touched */
  touch: (path: string) => void;
  /** Clear validation for a field */
  clear: (path: string) => void;
  /** Validate all fields */
  validateAll: () => boolean;
  /** Register field config */
  registerField: (path: string, config: ValidationConfig) => void;
}

const ValidationContext = createContext<ValidationContextValue | null>(null);

/**
 * Props for ValidationProvider
 */
export interface ValidationProviderProps {
  /** Custom validation functions from catalog */
  customFunctions?: Record<string, ValidationFunction>;
  children: ReactNode;
}

/**
 * Compare two DynamicValue args records shallowly.
 * Values are primitives or { $state: string }, so shallow comparison suffices.
 */
function dynamicArgsEqual(
  a: Record<string, unknown> | undefined,
  b: Record<string, unknown> | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    const va = a[key];
    const vb = b[key];
    if (va === vb) continue;
    // Handle { $state: string } objects
    if (
      typeof va === "object" &&
      va !== null &&
      typeof vb === "object" &&
      vb !== null
    ) {
      const sa = (va as Record<string, unknown>).$state;
      const sb = (vb as Record<string, unknown>).$state;
      if (typeof sa === "string" && sa === sb) continue;
    }
    return false;
  }
  return true;
}

/**
 * Structural equality check for ValidationConfig.
 */
function validationConfigEqual(
  a: ValidationConfig,
  b: ValidationConfig,
): boolean {
  if (a === b) return true;

  // Compare validateOn
  if (a.validateOn !== b.validateOn) return false;

  // Compare checks arrays
  const ac = a.checks ?? [];
  const bc = b.checks ?? [];
  if (ac.length !== bc.length) return false;

  for (let i = 0; i < ac.length; i++) {
    const ca = ac[i]!;
    const cb = bc[i]!;
    if (ca.type !== cb.type) return false;
    if (ca.message !== cb.message) return false;
    if (!dynamicArgsEqual(ca.args, cb.args)) return false;
  }

  return true;
}

/**
 * Provider for validation
 */
export function ValidationProvider({
  customFunctions = {},
  children,
}: ValidationProviderProps) {
  const { state } = useStateStore();
  const [fieldStates, setFieldStates] = useState<
    Record<string, FieldValidationState>
  >({});
  const [fieldConfigs, setFieldConfigs] = useState<
    Record<string, ValidationConfig>
  >({});

  const registerField = useCallback(
    (path: string, config: ValidationConfig) => {
      setFieldConfigs((prev) => {
        const existing = prev[path];
        // Bail out (return same reference) if config is unchanged to avoid
        // infinite re-render loops when callers pass a fresh object each render.
        if (existing && validationConfigEqual(existing, config)) {
          return prev;
        }
        return { ...prev, [path]: config };
      });
    },
    [],
  );

  const validate = useCallback(
    (path: string, config: ValidationConfig): ValidationResult => {
      // Walk the nested state object using JSON Pointer segments
      const segments = path.split("/").filter(Boolean);
      let value: unknown = state;
      for (const seg of segments) {
        if (value != null && typeof value === "object") {
          value = (value as Record<string, unknown>)[seg];
        } else {
          value = undefined;
          break;
        }
      }
      const result = runValidation(config, {
        value,
        stateModel: state,
        customFunctions,
      });

      setFieldStates((prev) => ({
        ...prev,
        [path]: {
          touched: prev[path]?.touched ?? true,
          validated: true,
          result,
        },
      }));

      return result;
    },
    [state, customFunctions],
  );

  const touch = useCallback((path: string) => {
    setFieldStates((prev) => ({
      ...prev,
      [path]: {
        ...prev[path],
        touched: true,
        validated: prev[path]?.validated ?? false,
        result: prev[path]?.result ?? null,
      },
    }));
  }, []);

  const clear = useCallback((path: string) => {
    setFieldStates((prev) => {
      const { [path]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const validateAll = useCallback(() => {
    let allValid = true;

    for (const [path, config] of Object.entries(fieldConfigs)) {
      const result = validate(path, config);
      if (!result.valid) {
        allValid = false;
      }
    }

    return allValid;
  }, [fieldConfigs, validate]);

  const value = useMemo<ValidationContextValue>(
    () => ({
      customFunctions,
      fieldStates,
      validate,
      touch,
      clear,
      validateAll,
      registerField,
    }),
    [
      customFunctions,
      fieldStates,
      validate,
      touch,
      clear,
      validateAll,
      registerField,
    ],
  );

  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
}

/**
 * Hook to access validation context
 */
export function useValidation(): ValidationContextValue {
  const ctx = useContext(ValidationContext);
  if (!ctx) {
    throw new Error("useValidation must be used within a ValidationProvider");
  }
  return ctx;
}

/**
 * Hook to get validation state for a field
 */
export function useFieldValidation(
  path: string,
  config?: ValidationConfig,
): {
  state: FieldValidationState;
  validate: () => ValidationResult;
  touch: () => void;
  clear: () => void;
  errors: string[];
  isValid: boolean;
} {
  const {
    fieldStates,
    validate: validateField,
    touch: touchField,
    clear: clearField,
    registerField,
  } = useValidation();

  // Use ref to track the last registered config to avoid re-registering when config is structurally equal
  const lastConfigRef = useRef<ValidationConfig | undefined>(undefined);
  
  // Create a stable key for the config to use in dependency array
  // This helps React know when to re-run the effect, but we still do structural comparison inside
  const configKey = useMemo(() => {
    if (!config) return null;
    // Create a simple key based on config structure (not perfect but good enough for dependency tracking)
    const checksKey = config.checks?.map(c => `${c.type}:${c.message}`).join(',') ?? '';
    return `${config.validateOn ?? 'default'}:${checksKey}`;
  }, [config]);

  // Register field on mount and when config actually changes
  useEffect(() => {
    if (config) {
      // Only register if config is different from last registered config (structural comparison)
      if (
        !lastConfigRef.current ||
        !validationConfigEqual(lastConfigRef.current, config)
      ) {
        registerField(path, config);
        lastConfigRef.current = config;
      }
    } else {
      // Clear registration if config becomes undefined
      lastConfigRef.current = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, registerField, configKey]); // Use configKey instead of config directly

  const state = fieldStates[path] ?? {
    touched: false,
    validated: false,
    result: null,
  };

  const validate = useCallback(
    () => validateField(path, config ?? { checks: [] }),
    [path, config, validateField],
  );

  const touch = useCallback(() => touchField(path), [path, touchField]);
  const clear = useCallback(() => clearField(path), [path, clearField]);

  return {
    state,
    validate,
    touch,
    clear,
    errors: state.result?.errors ?? [],
    isValid: state.result?.valid ?? true,
  };
}

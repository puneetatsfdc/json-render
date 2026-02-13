"use client";

import { useRef, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Renderer,
  type Spec,
  StateProvider,
  VisibilityProvider,
  ActionProvider,
  ValidationProvider,
  useValidation,
} from "@json-render/react";

import { registry, Fallback } from "./registry";

// =============================================================================
// PlaygroundRenderer
// =============================================================================

interface PlaygroundRendererProps {
  spec: Spec | null;
  data?: Record<string, unknown>;
  loading?: boolean;
}

const fallbackRenderer = (renderProps: { element: { type: string } }) => (
  <Fallback type={renderProps.element.type} />
);

/**
 * Inner component that sits inside ValidationProvider so it can call
 * useValidation() and wire validateAll into the formSubmit action handler.
 *
 * ActionProvider stores `handlers` in useState, so it only reads the initial
 * value. We use a ref so the handlers object is stable (created once) but
 * formSubmit always reads the latest validateAll.
 */
function ValidatedActions({ children }: { children: ReactNode }) {
  const { validateAll } = useValidation();
  const validateAllRef = useRef(validateAll);
  validateAllRef.current = validateAll;

  const handlers = useMemo<
    Record<string, (params: Record<string, unknown>) => void>
  >(
    () => ({
      buttonClick: (params) => {
        const message = (params?.message as string) || "Button clicked!";
        toast.success(message);
      },
      formSubmit: () => {
        const allValid = validateAllRef.current();
        if (!allValid) {
          toast.error("Please fix the errors before submitting.");
          return;
        }
        toast.success("Form submitted successfully!");
      },
      linkClick: (params) => {
        const href = (params?.href as string) || "#";
        toast.info(`Navigating to: ${href}`);
      },
    }),
    [], // stable — ref ensures latest validateAll is always used
  );

  return <ActionProvider handlers={handlers}>{children}</ActionProvider>;
}

export function PlaygroundRenderer({
  spec,
  data,
  loading,
}: PlaygroundRendererProps): ReactNode {
  if (!spec) return null;

  return (
    <StateProvider initialState={data ?? spec.state}>
      <VisibilityProvider>
        <ValidationProvider>
          <ValidatedActions>
            <Renderer
              spec={spec}
              registry={registry}
              fallback={fallbackRenderer}
              loading={loading}
            />
          </ValidatedActions>
        </ValidationProvider>
      </VisibilityProvider>
    </StateProvider>
  );
}

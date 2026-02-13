"use client";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-muted-foreground/10 ${className}`} />;
}

/** Simple form wireframe reused in both diagrams */
function FormUI() {
  return (
    <div className="border border-border rounded-lg p-2.5 space-y-1.5 bg-muted/30">
      {/* Title */}
      <Skeleton className="h-2.5 w-14 mb-1" />
      {/* Input fields */}
      <Skeleton className="h-4 w-full rounded-sm" />
      <Skeleton className="h-4 w-full rounded-sm" />
      {/* Submit button */}
      <Skeleton className="h-4 w-16 rounded-sm bg-muted-foreground/20 mt-1" />
    </div>
  );
}

function ChatModeDiagram() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-xs font-medium text-muted-foreground mb-3 text-center">
        Chat Mode
      </div>
      <div className="flex-1 border border-border rounded-lg bg-background overflow-hidden flex flex-col">
        {/* Chat area */}
        <div className="flex-1 p-3 overflow-hidden flex justify-center">
          <div className="w-1/3 min-w-[120px] space-y-3">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-muted rounded-xl px-3 py-2">
                <Skeleton className="h-2 w-14" />
              </div>
            </div>

            {/* Assistant text */}
            <div className="space-y-2">
              <div className="space-y-1.5">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-3/4" />
              </div>

              {/* Inline UI */}
              <FormUI />

              {/* More text after UI */}
              <div className="space-y-1.5">
                <Skeleton className="h-2 w-4/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="p-2 flex justify-center">
          <div className="w-1/3 min-w-[120px] flex items-center gap-2">
            <Skeleton className="h-7 flex-1 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground/60 mt-2 text-center">
        Text + UI interleaved in messages
      </div>
    </div>
  );
}

function GenerateModeDiagram() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-xs font-medium text-muted-foreground mb-3 text-center">
        Generate Mode
      </div>
      <div className="flex-1 border border-border rounded-lg bg-background overflow-hidden flex flex-row">
        {/* Left panel - prompt */}
        <div className="w-[38%] border-r border-border flex flex-col">
          <div className="flex-1" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-7 w-full rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
        </div>

        {/* Right panel - UI preview */}
        <div className="flex-1 p-3 flex items-center justify-center">
          <div className="w-3/4">
            <FormUI />
          </div>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground/60 mt-2 text-center">
        Prompt separate from UI preview
      </div>
    </div>
  );
}

export function GenerationModesDiagram() {
  return (
    <div className="not-prose my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="h-[280px]">
          <ChatModeDiagram />
        </div>
        <div className="h-[280px]">
          <GenerateModeDiagram />
        </div>
      </div>
    </div>
  );
}

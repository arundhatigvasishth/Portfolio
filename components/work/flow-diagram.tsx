import { Fragment } from "react"
import { cn } from "@/lib/utils"

export type FlowNode = { title: string; sub?: string; accent?: boolean }
export type FlowLane = { label: string; nodes: FlowNode[] }

// A lane-based architecture diagram in plain HTML, so it reflows on small
// screens: rows on desktop, a vertical stack on mobile. Connectors carry a
// slow travelling dash that only runs when motion is allowed.
export function FlowDiagram({ lanes, compact = false }: { lanes: FlowLane[]; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      {lanes.map((lane) => (
        <div key={lane.label} className="flex flex-col gap-2.5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{lane.label}</p>
          <ol className={cn("flex gap-0", compact ? "flex-row flex-wrap items-center gap-y-2 sm:flex-nowrap" : "flex-col md:flex-row md:items-stretch")}>
            {lane.nodes.map((node, i) => (
              <Fragment key={node.title}>
                {i > 0 ? <Connector compact={compact} /> : null}
                <li
                  className={cn(
                    "min-w-0 rounded-2xl border bg-background",
                    compact
                      ? "flex min-h-10 flex-none items-center justify-center px-3 py-1.5 text-center sm:min-h-14 sm:flex-1 sm:px-2"
                      : "flex-1 px-4 py-3",
                    node.accent ? "border-primary/50 bg-primary/[0.05]" : "border-border",
                  )}
                >
                  <p className={cn("font-medium text-foreground", compact ? "text-xs leading-tight" : "text-sm")}>{node.title}</p>
                  {node.sub && !compact ? <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{node.sub}</p> : null}
                </li>
              </Fragment>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}

function Connector({ compact }: { compact: boolean }) {
  return (
    <span
      aria-hidden="true"
      data-responsive={compact ? undefined : ""}
      className={cn(
        "flow-connector relative shrink-0 self-center",
        compact ? "mx-1 h-[2px] w-4" : "my-1 h-5 w-[2px] md:mx-1.5 md:my-0 md:h-[2px] md:w-6",
      )}
    />
  )
}

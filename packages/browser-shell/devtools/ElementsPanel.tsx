"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, MousePointerSquareDashed, RefreshCw } from "lucide-react";
import { useBrowserStore, tabUrl } from "@jaios/kernel/browser-store";
import { isInternalUrl } from "../lib/routes";
import { cn } from "@jaios/ui/utils";

interface DNode {
  id: string;
  tag: string;
  idAttr?: string;
  cls: string[];
  el: Element;
  children: DNode[];
  text?: string;
}

const PAGE_ROOT_ID = "jai-page-root";

function buildTree(): { root: DNode | null; map: Map<Element, DNode> } {
  const map = new Map<Element, DNode>();
  const host = document.getElementById(PAGE_ROOT_ID);
  const start = host?.firstElementChild ?? host;
  if (!start) return { root: null, map };
  let uid = 0;
  function walk(el: Element, depth: number): DNode {
    const node: DNode = {
      id: `n${uid++}`,
      tag: el.tagName.toLowerCase(),
      idAttr: el.id || undefined,
      cls: Array.from(el.classList).slice(0, 3),
      el,
      children: [],
    };
    map.set(el, node);
    if (depth < 14) {
      for (const child of Array.from(el.children)) node.children.push(walk(child, depth + 1));
    }
    if (node.children.length === 0) {
      const t = el.textContent?.trim() ?? "";
      if (t) node.text = t.slice(0, 64);
    }
    return node;
  }
  return { root: walk(start, 0), map };
}

export function ElementsPanel() {
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const reloadKey = useBrowserStore((s) => s.reloadKey);
  const tab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const url = tab ? tabUrl(tab) : "jai://home";

  const [refresh, setRefresh] = useState(0);
  const [tree, setTree] = useState<DNode | null>(null);
  const mapRef = useRef<Map<Element, DNode>>(new Map());
  const [selected, setSelected] = useState<Element | null>(null);
  const [hover, setHover] = useState<Element | null>(null);
  const [picking, setPicking] = useState(false);

  // (Re)build the tree after the page renders.
  useEffect(() => {
    if (!isInternalUrl(url)) {
      setTree(null);
      return;
    }
    const t = setTimeout(() => {
      const { root, map } = buildTree();
      mapRef.current = map;
      setTree(root);
      setSelected(null);
    }, 40);
    return () => clearTimeout(t);
  }, [url, reloadKey, refresh]);

  // Inspect-cursor picker.
  useEffect(() => {
    if (!picking) return;
    function nodeAt(x: number, y: number): Element | null {
      let cur = document.elementFromPoint(x, y);
      while (cur && !mapRef.current.has(cur)) cur = cur.parentElement;
      return cur;
    }
    function move(e: MouseEvent) {
      setHover(nodeAt(e.clientX, e.clientY));
    }
    function click(e: MouseEvent) {
      const el = nodeAt(e.clientX, e.clientY);
      if (el) {
        e.preventDefault();
        e.stopPropagation();
        setSelected(el);
        setPicking(false);
        setHover(null);
      }
    }
    document.addEventListener("mousemove", move, true);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("mousemove", move, true);
      document.removeEventListener("click", click, true);
    };
  }, [picking]);

  const highlightEl = hover ?? selected;

  if (!isInternalUrl(url)) {
    return (
      <div className="grid h-full place-items-center px-6 text-center text-xs text-faint">
        Cross-origin frame — its DOM can&apos;t be inspected from here.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col text-xs">
      <div className="flex items-center gap-1 border-b border-line px-2 py-1 text-faint">
        <button
          type="button"
          onClick={() => setPicking((p) => !p)}
          aria-label="Inspect element"
          aria-pressed={picking}
          className={cn("grid h-6 w-6 place-items-center rounded hover:bg-ink/5 hover:text-ink", picking && "bg-accent/15 text-accent")}
        >
          <MousePointerSquareDashed className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => setRefresh((r) => r + 1)} aria-label="Refresh DOM" className="grid h-6 w-6 place-items-center rounded hover:bg-ink/5 hover:text-ink">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
        <span className="ml-1">Elements</span>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="min-h-0 flex-1 overflow-auto px-2 py-1.5 font-mono">
          {tree ? (
            <TreeNode node={tree} selected={selected} onHover={setHover} onSelect={setSelected} depth={0} />
          ) : (
            <p className="text-faint">No DOM captured. Click refresh.</p>
          )}
        </div>
        {selected && <StylesPane el={selected} />}
      </div>

      {highlightEl && <HighlightOverlay el={highlightEl} />}
    </div>
  );
}

function TreeNode({
  node,
  selected,
  onHover,
  onSelect,
  depth,
}: {
  node: DNode;
  selected: Element | null;
  onHover: (el: Element | null) => void;
  onSelect: (el: Element) => void;
  depth: number;
}) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const isSel = selected === node.el;

  return (
    <div>
      <div
        onMouseEnter={() => onHover(node.el)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect(node.el)}
        className={cn("flex cursor-default items-center gap-1 rounded px-1 leading-relaxed hover:bg-ink/[0.04]", isSel && "bg-accent/10")}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            className="grid h-3.5 w-3.5 shrink-0 place-items-center text-faint"
          >
            <ChevronRight className={cn("h-3 w-3 transition-transform", open && "rotate-90")} />
          </button>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <span className="truncate">
          <span className="text-blue">&lt;{node.tag}</span>
          {node.idAttr && <span className="text-amber"> id=&quot;{node.idAttr}&quot;</span>}
          {node.cls.length > 0 && <span className="text-mint"> class=&quot;{node.cls.join(" ")}&quot;</span>}
          <span className="text-blue">&gt;</span>
          {!open && node.text && <span className="text-faint"> {node.text}</span>}
        </span>
      </div>
      {open && hasChildren && (
        <div className="ml-3 border-l border-line/60 pl-2">
          {node.children.map((c) => (
            <TreeNode key={c.id} node={c} selected={selected} onHover={onHover} onSelect={onSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function StylesPane({ el }: { el: Element }) {
  const styles = useMemo(() => {
    const cs = getComputedStyle(el);
    const pick = ["display", "color", "background-color", "font-size", "font-weight", "padding", "margin", "border-radius"];
    return pick.map((p) => [p, cs.getPropertyValue(p)] as const).filter(([, v]) => v && v !== "none" && v !== "normal");
  }, [el]);

  return (
    <div className="w-1/2 min-w-0 overflow-auto border-l border-line px-2 py-1.5 font-mono">
      <p className="text-faint">Styles</p>
      <div className="mt-1 text-[11px] leading-relaxed">
        <span className="text-violet">element.style</span> <span className="text-ink">{"{"}</span>
        {styles.map(([p, v]) => (
          <div key={p} className="pl-3">
            <span className="text-blue">{p}</span>
            <span className="text-ink">: </span>
            <span className="text-mint">{v.trim()}</span>
            <span className="text-ink">;</span>
          </div>
        ))}
        <span className="text-ink">{"}"}</span>
      </div>
    </div>
  );
}

function HighlightOverlay({ el }: { el: Element }) {
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed z-[60] border border-accent bg-accent/10"
        style={{ left: r.left, top: r.top, width: r.width, height: r.height }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed z-[61] rounded bg-ink px-1.5 py-0.5 text-[10px] font-medium text-bg"
        style={{ left: r.left, top: Math.max(2, r.top - 18) }}
      >
        {el.tagName.toLowerCase()} · {Math.round(r.width)}×{Math.round(r.height)}
      </div>
    </>
  );
}

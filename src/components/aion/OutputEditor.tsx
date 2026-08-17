import { useEffect, useRef, useState } from "react";
import { Copy, Download, RefreshCw, Braces, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type Props = {
  storageKey: string;
  value: string;
  onChange: (value: string) => void;
  onRegenerate?: () => void;
  loading?: boolean;
  emptyHint: string;
};

export function OutputEditor({
  storageKey,
  value,
  onChange,
  onRegenerate,
  loading,
  emptyHint,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  const persist = (text: string) => {
    onChange(text);
    try {
      window.localStorage.setItem(storageKey, text);
    } catch {
      /* storage unavailable */
    }
  };

  if (loading) {
    return (
      <div className="glass-card flex min-h-64 flex-col items-center justify-center gap-3 p-10 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">AION is thinking…</p>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="glass-card flex min-h-64 flex-col items-center justify-center gap-2 p-10 text-center">
        <p className="font-sans text-base font-semibold text-foreground">Nothing generated yet</p>
        <p className="max-w-md text-sm text-muted-foreground">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
            toast.success("Copied to clipboard");
          }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
        </Button>
        {onRegenerate && (
          <Button size="sm" variant="secondary" onClick={onRegenerate}>
            <RefreshCw className="h-4 w-4" /> Regenerate
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            const next = `${value}\n\n{{recipient_name}} · {{company}} · {{date}}`;
            persist(next);
            toast.info("Variables inserted — edit them inline");
          }}
        >
          <Braces className="h-4 w-4" /> Insert Variables
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${storageKey}.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="h-4 w-4" /> Export
        </Button>
        <span className="ml-auto text-[11px] text-muted-foreground">
          Click any generated text to edit — saved locally.
        </span>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => persist((e.target as HTMLDivElement).innerText)}
        className="min-h-64 whitespace-pre-wrap px-5 py-4 text-sm leading-relaxed text-foreground outline-none focus:bg-accent/20"
      />
    </div>
  );
}

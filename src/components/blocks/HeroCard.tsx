import * as React from "react";
import { cn } from "@/lib/utils";
import { AIDot } from "@/components/ai/AIDot";
import { StreamingText } from "@/components/ai/StreamingText";
import { SpringIn } from "@/components/ai/SpringIn";

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  cta?: React.ReactNode;
  rightMeta?: string;
  className?: string;
};

export function HeroCard({ eyebrow, title, body, cta, rightMeta, className }: Props) {
  return (
    <SpringIn>
      <section
        className={cn(
          "bg-surface-mint rounded-md p-9 flex items-start justify-between gap-6",
          className,
        )}
      >
        <div className="space-y-2.5 max-w-[680px]">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[12px] font-medium tracking-[0.08em] uppercase text-surface-deep">
              {eyebrow}
            </span>
          </div>
          <h1 className="text-[40px] leading-[44px] font-bold tracking-[-0.02em] text-ink">
            {title}
          </h1>
          <p className="text-[15px] leading-[24px] text-ink">
            <StreamingText text={body} cps={75} caret={false} />
          </p>
        </div>
        {cta && (
          <div className="flex flex-col items-end gap-2 shrink-0">
            {cta}
            {rightMeta && <span className="text-[12px] text-surface-deep">{rightMeta}</span>}
          </div>
        )}
      </section>
    </SpringIn>
  );
}

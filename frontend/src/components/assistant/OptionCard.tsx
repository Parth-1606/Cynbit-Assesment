/**
 * A single selectable option card used by the multiple-choice steps.
 * Rendered as a real radio input (visually hidden) so keyboard navigation
 * and screen-reader group semantics work without custom ARIA wiring.
 */
import { Check } from 'lucide-react';
import type { Option } from '../../types';

interface OptionCardProps {
  option: Option;
  name: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function OptionCard({ option, name, selected, onSelect }: OptionCardProps) {
  const Icon = option.icon;

  return (
    <label
      className={`group relative flex cursor-pointer items-start gap-3 rounded-xl border p-4
        transition-all duration-200 animate-fade-up
        ${
          selected
            ? 'border-accent-blue bg-accent-blue/12 shadow-[0_0_0_1px_rgb(59_130_246_/_0.5),0_12px_30px_-18px_rgb(59_130_246_/_0.9)]'
            : 'border-hairline bg-navy-900/60 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06]'
        }`}
    >
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={selected}
        onChange={() => onSelect(option.value)}
        className="peer sr-only"
      />

      {/* Icon badge */}
      <span
        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
          selected
            ? 'bg-gradient-to-br from-accent-blue to-accent-purple text-white'
            : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
        }`}
        aria-hidden="true"
      >
        {Icon ? <Icon className="size-[18px]" /> : null}
      </span>

      {/* Label block */}
      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-semibold leading-snug ${
            selected ? 'text-white' : 'text-slate-200'
          }`}
        >
          {option.label}
        </span>
        {option.hint && (
          <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
            {option.hint}
          </span>
        )}
      </span>

      {/* Selection tick */}
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-all ${
          selected
            ? 'border-accent-blue bg-accent-blue text-white'
            : 'border-slate-600 text-transparent peer-focus-visible:border-accent-blue'
        }`}
        aria-hidden="true"
      >
        <Check className="size-3" strokeWidth={3} />
      </span>

      {/* Keyboard focus ring (peer-driven, since the input is hidden). */}
      <span
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity peer-focus-visible:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-blue"
        aria-hidden="true"
      />
    </label>
  );
}

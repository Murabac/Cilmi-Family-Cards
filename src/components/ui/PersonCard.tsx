"use client";

import { motion } from "framer-motion";
import type { TreeNode } from "@/lib/types";
import {
  cleanPhone,
  personDescription,
  telUrl,
  whatsappUrl,
} from "@/lib/person";

export function PersonCard({
  person,
  relationHint,
  onParent,
  onSwipeLeft,
  onSwipeRight,
}: {
  person: TreeNode;
  relationHint?: string;
  onParent?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  const phone = cleanPhone(person.phone_number);
  const description = personDescription(person);
  const name = person.full_name?.trim() || "Unknown";
  const nameLen = name.length;
  const titleClass =
    nameLen > 32
      ? "text-xs sm:text-sm"
      : nameLen > 22
        ? "text-sm sm:text-base"
        : nameLen > 14
          ? "text-base sm:text-lg"
          : "text-lg sm:text-xl";
  const heroNameClass =
    nameLen > 28
      ? "text-base sm:text-lg"
      : nameLen > 18
        ? "text-lg sm:text-xl"
        : "text-xl sm:text-2xl";

  return (
    <motion.article
      key={person.id}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.55}
      onDragEnd={(_, info) => {
        if (info.offset.x < -70 || info.velocity.x < -400) onSwipeLeft?.();
        else if (info.offset.x > 70 || info.velocity.x > 400) onSwipeRight?.();
      }}
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
      className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[22px] bg-[#F0E6D6] shadow-[0_16px_40px_rgba(0,0,0,0.3)] ring-1 ring-[#E4D5BE] sm:rounded-[28px]"
    >
      {/* Image takes remaining space */}
      <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-gradient-to-br from-[#234A5E] via-[#3BA99C]/70 to-[#E8A838]/80">
        {person.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.avatar_url}
            alt={name}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center px-4">
            <p
              className={`max-w-[90%] text-center font-[family-name:var(--font-display)] leading-snug font-semibold text-[#F0E6D6] drop-shadow ${heroNameClass}`}
            >
              {name}
            </p>
          </div>
        )}
        {relationHint &&
          (onParent ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onParent();
              }}
              title="Go to parent"
              className="absolute top-2 left-2 max-w-[85%] truncate rounded-full bg-[#1B3A4B]/85 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#E8A838] uppercase shadow sm:top-3 sm:left-3 sm:text-[11px]"
            >
              ← {relationHint}
            </button>
          ) : (
            <span className="absolute top-2 left-2 max-w-[85%] truncate rounded-full bg-[#1B3A4B]/85 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#E8A838] uppercase shadow sm:top-3 sm:left-3 sm:text-[11px]">
              {relationHint}
            </span>
          ))}
      </div>

      {/* Name, info, and actions sit together at the bottom */}
      <div className="flex shrink-0 items-stretch gap-2.5 border-t border-[#E4D5BE] bg-[#F0E6D6] px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        <div className="min-w-0 flex-1">
          <h1
            className={`line-clamp-2 font-[family-name:var(--font-display)] font-semibold leading-snug text-[#1B3A4B] ${titleClass}`}
          >
            {name}
          </h1>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug font-semibold text-[#5A7180] sm:text-xs">
            {description}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {person.city?.trim() && <Chip>{person.city.trim()}</Chip>}
            {person.occupation?.trim() && <Chip>{person.occupation.trim()}</Chip>}
            <Chip>Gen {person.depth}</Chip>
          </div>
        </div>

        <div className="flex w-[5.75rem] shrink-0 flex-col justify-center gap-1.5 sm:w-28 sm:gap-2">
          {phone ? (
            <>
              <a
                href={whatsappUrl(phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-9 flex-1 items-center justify-center gap-1 rounded-xl bg-[#1F8B4D] px-1.5 text-[10px] font-extrabold text-[#F0E6D6] active:scale-[0.98] sm:min-h-10 sm:rounded-2xl sm:text-xs"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
              <a
                href={telUrl(phone)}
                className="flex min-h-9 flex-1 items-center justify-center rounded-xl bg-[#1B3A4B] px-1.5 text-[10px] font-extrabold text-[#F0E6D6] active:scale-[0.98] sm:min-h-10 sm:rounded-2xl sm:text-xs"
              >
                Call
              </a>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-xl bg-[#E4D5BE] px-2 text-center text-[10px] leading-tight font-bold text-[#5A7180] sm:rounded-2xl sm:text-[11px]">
              No phone
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#E4D5BE] px-2 py-0.5 text-[9px] font-bold text-[#1B3A4B] sm:px-2.5 sm:text-[10px]">
      {children}
    </span>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

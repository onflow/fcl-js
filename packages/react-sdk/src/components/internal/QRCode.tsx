import React from "react"

export interface QRCodeProps {
  label?: string
}

export const QRCode: React.FC<QRCodeProps> = ({
  label = "Scan to send",
}) => {
  return (
    <div className="flow-flex flow-flex-col flow-items-center flow-py-6 flow-gap-3">
      <div className="flow-w-[200px] flow-h-[200px] flow-bg-white dark:flow-bg-slate-900 flow-rounded-lg flow-p-3 flow-border flow-border-slate-200 dark:flow-border-slate-700">
        <svg viewBox="0 0 100 100" className="flow-w-full flow-h-full">
          {/* Top-left corner marker */}
          <rect x="0" y="0" width="28" height="28" fill="#000" />
          <rect x="4" y="4" width="20" height="20" fill="#fff" />
          <rect x="8" y="8" width="12" height="12" fill="#000" />

          {/* Top-right corner marker */}
          <rect x="72" y="0" width="28" height="28" fill="#000" />
          <rect x="76" y="4" width="20" height="20" fill="#fff" />
          <rect x="80" y="8" width="12" height="12" fill="#000" />

          {/* Bottom-left corner marker */}
          <rect x="0" y="72" width="28" height="28" fill="#000" />
          <rect x="4" y="76" width="20" height="20" fill="#fff" />
          <rect x="8" y="80" width="12" height="12" fill="#000" />

          {/* Data pattern - scattered squares */}
          <rect x="36" y="4" width="4" height="4" fill="#000" />
          <rect x="44" y="4" width="4" height="4" fill="#000" />
          <rect x="52" y="4" width="4" height="4" fill="#000" />
          <rect x="60" y="4" width="4" height="4" fill="#000" />

          <rect x="32" y="12" width="4" height="4" fill="#000" />
          <rect x="40" y="12" width="4" height="4" fill="#000" />
          <rect x="56" y="12" width="4" height="4" fill="#000" />
          <rect x="64" y="12" width="4" height="4" fill="#000" />

          <rect x="36" y="20" width="4" height="4" fill="#000" />
          <rect x="48" y="20" width="4" height="4" fill="#000" />
          <rect x="60" y="20" width="4" height="4" fill="#000" />

          <rect x="4" y="32" width="4" height="4" fill="#000" />
          <rect x="12" y="32" width="4" height="4" fill="#000" />
          <rect x="24" y="32" width="4" height="4" fill="#000" />
          <rect x="36" y="32" width="4" height="4" fill="#000" />
          <rect x="48" y="32" width="4" height="4" fill="#000" />
          <rect x="60" y="32" width="4" height="4" fill="#000" />
          <rect x="72" y="32" width="4" height="4" fill="#000" />
          <rect x="84" y="32" width="4" height="4" fill="#000" />
          <rect x="92" y="32" width="4" height="4" fill="#000" />

          <rect x="8" y="40" width="4" height="4" fill="#000" />
          <rect x="20" y="40" width="4" height="4" fill="#000" />
          <rect x="32" y="40" width="4" height="4" fill="#000" />
          <rect x="44" y="40" width="4" height="4" fill="#000" />
          <rect x="56" y="40" width="4" height="4" fill="#000" />
          <rect x="68" y="40" width="4" height="4" fill="#000" />
          <rect x="80" y="40" width="4" height="4" fill="#000" />
          <rect x="92" y="40" width="4" height="4" fill="#000" />

          <rect x="4" y="48" width="4" height="4" fill="#000" />
          <rect x="16" y="48" width="4" height="4" fill="#000" />
          <rect x="28" y="48" width="4" height="4" fill="#000" />
          <rect x="40" y="48" width="4" height="4" fill="#000" />
          <rect x="52" y="48" width="4" height="4" fill="#000" />
          <rect x="64" y="48" width="4" height="4" fill="#000" />
          <rect x="76" y="48" width="4" height="4" fill="#000" />
          <rect x="88" y="48" width="4" height="4" fill="#000" />

          <rect x="8" y="56" width="4" height="4" fill="#000" />
          <rect x="20" y="56" width="4" height="4" fill="#000" />
          <rect x="36" y="56" width="4" height="4" fill="#000" />
          <rect x="48" y="56" width="4" height="4" fill="#000" />
          <rect x="60" y="56" width="4" height="4" fill="#000" />
          <rect x="72" y="56" width="4" height="4" fill="#000" />
          <rect x="84" y="56" width="4" height="4" fill="#000" />

          <rect x="4" y="64" width="4" height="4" fill="#000" />
          <rect x="16" y="64" width="4" height="4" fill="#000" />
          <rect x="28" y="64" width="4" height="4" fill="#000" />
          <rect x="44" y="64" width="4" height="4" fill="#000" />
          <rect x="56" y="64" width="4" height="4" fill="#000" />
          <rect x="68" y="64" width="4" height="4" fill="#000" />
          <rect x="80" y="64" width="4" height="4" fill="#000" />
          <rect x="92" y="64" width="4" height="4" fill="#000" />

          <rect x="32" y="76" width="4" height="4" fill="#000" />
          <rect x="44" y="76" width="4" height="4" fill="#000" />
          <rect x="56" y="76" width="4" height="4" fill="#000" />
          <rect x="68" y="76" width="4" height="4" fill="#000" />
          <rect x="80" y="76" width="4" height="4" fill="#000" />
          <rect x="92" y="76" width="4" height="4" fill="#000" />

          <rect x="36" y="84" width="4" height="4" fill="#000" />
          <rect x="48" y="84" width="4" height="4" fill="#000" />
          <rect x="64" y="84" width="4" height="4" fill="#000" />
          <rect x="76" y="84" width="4" height="4" fill="#000" />
          <rect x="88" y="84" width="4" height="4" fill="#000" />

          <rect x="32" y="92" width="4" height="4" fill="#000" />
          <rect x="40" y="92" width="4" height="4" fill="#000" />
          <rect x="52" y="92" width="4" height="4" fill="#000" />
          <rect x="60" y="92" width="4" height="4" fill="#000" />
          <rect x="72" y="92" width="4" height="4" fill="#000" />
          <rect x="84" y="92" width="4" height="4" fill="#000" />
        </svg>
      </div>
      <span className="flow-text-sm flow-font-medium flow-text-slate-500 dark:flow-text-slate-400">
        {label}
      </span>
    </div>
  )
}

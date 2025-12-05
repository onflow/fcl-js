import React, {useMemo, Fragment} from "react"
import QRCodeLib from "qrcode"

export interface QRCodeProps {
  value: string
  size?: number
}

export const QRCode: React.FC<QRCodeProps> = ({value, size = 200}) => {
  const {modules, length, findingPatternPositions} = useMemo(() => {
    if (!value) {
      return {modules: [], length: 0, findingPatternPositions: []}
    }

    const qr = QRCodeLib.create(value, {
      errorCorrectionLevel: "H",
    })
    const modules1D = Array.from(qr.modules.data)
    const modules: boolean[][] = []
    const length = qr.modules.size

    // Check if the module is part of the finder pattern
    const isFindingPattern = (x: number, y: number) =>
      (x < 8 && (y < 8 || y >= length - 8)) ||
      (x >= length - 8 && y < 8)

    for (let i = 0; i < length; i++) {
      modules.push(
        [...modules1D.slice(i * length, (i + 1) * length)].map((bit, j) => {
          return bit === 1 && !isFindingPattern(i, j)
        }),
      )
    }

    // Positions of the finder patterns used for custom rendering
    const findingPatternPositions = [
      [0, 0],
      [0, length - 7],
      [length - 7, 0],
    ]

    return {modules, length, findingPatternPositions}
  }, [value])

  if (!value || length === 0) {
    return null
  }

  return (
    <div className="flow-flex flow-flex-col flow-items-center flow-py-6">
      <div
        className="flow-relative flow-bg-white dark:flow-bg-slate-900
          flow-rounded-lg flow-p-3 flow-border flow-border-slate-200
          dark:flow-border-slate-700"
        style={{width: size, height: size}}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${length} ${length}`}
          className="flow-w-full flow-h-full"
        >
          <g className="flow-text-slate-900 dark:flow-text-slate-100">
            {modules.map((row, y) =>
              row.map((cell, x) =>
                cell ? (
                  <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width={1}
                    height={1}
                    fill="currentColor"
                  />
                ) : null,
              ),
            )}

            {findingPatternPositions.map(([x, y]) => {
              return (
                <Fragment key={`${x}-${y}`}>
                  <g transform={`translate(${x}, ${y})`}>
                    <path
                      d="
                        M 2 0 h 3 a 2 2 0 0 1 2 2 v 3 a 2 2 0 0 1 -2 2 h -3 a 2 2 0 0 1 -2 -2 v -3 a 2 2 0 0 1 2 -2
                        M 2.5 1 h 2 a 1.5 1.5 0 0 1 1.5 1.5 v 2 a 1.5 1.5 0 0 1 -1.5 1.5 h -2 a 1.5 1.5 0 0 1 -1.5 -1.5 v -2 a 1.5 1.5 0 0 1 1.5 -1.5 Z
                      "
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </g>

                  <rect
                    x={x + 2}
                    y={y + 2}
                    width={3}
                    height={3}
                    fill="currentColor"
                  />
                </Fragment>
              )
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}

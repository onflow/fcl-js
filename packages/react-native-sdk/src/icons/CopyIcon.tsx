import React from "react"
import {Svg, Path, Rect} from "react-native-svg"

interface IconProps {
  size?: number
  color?: string
}

export const CopyIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#0F172A",
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Rect width={14} height={14} x={8} y={8} rx={2} ry={2} />
    <Path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </Svg>
)

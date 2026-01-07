import React from "react"
import {Svg, Path} from "react-native-svg"

interface IconProps {
  size?: number
  color?: string
}

export const ChevronDownIcon: React.FC<IconProps> = ({
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
    <Path d="m6 9 6 6 6-6" />
  </Svg>
)

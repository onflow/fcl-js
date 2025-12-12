import React from "react"
import {Svg, Path, Circle} from "react-native-svg"

interface IconProps {
  size?: number
  color?: string
}

export const UserIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#64748B",
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
    <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </Svg>
)

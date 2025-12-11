import React from "react"
import Svg, {Path} from "react-native-svg"

interface IconProps {
  size?: number
  color?: string
}

export const CheckIcon: React.FC<IconProps> = ({
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
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
)

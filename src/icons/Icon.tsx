import iconMap from "./assets/icon-map";
import type { IconProps } from "./types";

const EmptyIcon = () => <div />;

const Icon = ({
  name = "",
  size,
  color,
  disabled,
  onClick = () => null,
  style,
  ...rest
}: IconProps) => {
  const Icon = iconMap[name] || EmptyIcon;
  return (
    <Icon
      color={color}
      style={{
        width: size,
        height: size,
        opacity: disabled ? 0.3 : 1,
        ...(style && { ...style }),
        ...(disabled && { cursor: "not-allowed" }),
      }}
      onClick={(e: React.MouseEvent<SVGElement>) => !disabled && onClick(e)}
      {...rest}
    />
  );
};

export default Icon;

export type IconProps = {
  className?: string;
  name?: string;
  size?: string;
  color?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<SVGElement>) => void;
  style?: React.CSSProperties;
};

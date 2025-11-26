import { toPascalCase } from "./utils.js";
import { writeFileSync } from "fs";

export const generateIconComponentFile = (icons, { dir }) => {
  const indexContent = [
    "import Icon from './Icon';",
    "import type { IconProps } from './types';",
    "export type IconProps = IconProps;",
    icons
      ?.map(
        (icon) =>
          `export const ${toPascalCase(
            icon
          )} = (props : IconProps) => <Icon {...props} name="${icon}" />;`
      )
      .join("\n"),
  ].join("\n");

  writeFileSync(`${dir}/index.tsx`, indexContent);
  console.log("Icon component file created! ✅");
};

export const generateWebIconMap = (icons, { dir }) => {
  const iconMapContent = [
    icons?.map((icon) => `import ${toPascalCase(icon)} from './${icon}.svg?react';`).join("\n"),
    "",
    `const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {`,
    ...icons.map((icon) => `  "${icon}": ${toPascalCase(icon)},`),
    `};`,
    ``,
    `export default iconMap;`,
  ].join("\n");

  writeFileSync(`${dir}/icon-map.tsx`, iconMapContent);
  console.log("Web Icon Map created! ✅");
};

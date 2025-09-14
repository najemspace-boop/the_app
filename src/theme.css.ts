// theme.css.ts
import { theme } from './theme';
import { themeToVars } from '@mantine/vanilla-extract';

// CSS variables object, can be accessed in *.css.ts files
export const vars = themeToVars(theme);
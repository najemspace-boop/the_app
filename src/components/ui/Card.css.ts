// Card.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../theme.css';

export const cardBase = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.colors.gray[3]}`,
  backgroundColor: vars.colors.white,
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  transition: 'all 0.2s ease',

  selectors: {
    [vars.darkSelector]: {
      backgroundColor: vars.colors.gray[9],
      borderColor: vars.colors.gray[7],
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
    },
  },
});

export const cardHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing.xs,
  padding: vars.spacing.lg,
});

export const cardTitle = style({
  fontSize: vars.fontSizes.xl,
  fontWeight: '600',
  lineHeight: '1',
  letterSpacing: '-0.025em',
  color: vars.colors.gray[9],

  selectors: {
    [vars.darkSelector]: {
      color: vars.colors.gray[1],
    },
  },
});

export const cardDescription = style({
  fontSize: vars.fontSizes.sm,
  color: vars.colors.gray[6],

  selectors: {
    [vars.darkSelector]: {
      color: vars.colors.gray[4],
    },
  },
});

export const cardContent = style({
  padding: vars.spacing.lg,
  paddingTop: 0,
});

export const cardFooter = style({
  display: 'flex',
  alignItems: 'center',
  padding: vars.spacing.lg,
  paddingTop: 0,
});
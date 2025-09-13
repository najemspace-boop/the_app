// Input.css.ts
import { style } from '@vanilla-extract/css';
import { rem } from '@mantine/core';
import { vars } from '../../theme.css';

export const inputBase = style({
  display: 'flex',
  height: rem(40),
  width: '100%',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.colors.gray[3]}`,
  backgroundColor: vars.colors.white,
  paddingLeft: vars.spacing.sm,
  paddingRight: vars.spacing.sm,
  fontSize: vars.fontSizes.sm,
  transition: 'all 0.2s ease',
  
  '::placeholder': {
    color: vars.colors.gray[5],
  },
  
  ':focus': {
    outline: 'none',
    borderColor: vars.colors.blue[5],
    boxShadow: `0 0 0 2px ${vars.colors.blue[2]}`,
  },
  
  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  selectors: {
    [vars.darkSelector]: {
      backgroundColor: vars.colors.gray[8],
      borderColor: vars.colors.gray[6],
      color: vars.colors.gray[1],
      
      '::placeholder': {
        color: vars.colors.gray[5],
      },
      
      ':focus': {
        borderColor: vars.colors.blue[4],
        boxShadow: `0 0 0 2px ${vars.colors.blue[8]}`,
      },
    },
  },
});
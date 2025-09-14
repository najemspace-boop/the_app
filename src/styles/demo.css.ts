// Demo.css.ts - Example usage of Vanilla Extract with Mantine theme
import { style } from '@vanilla-extract/css';
import { rem, em } from '@mantine/core';
import { vars } from '../theme.css';

export const demo = style({
  fontSize: vars.fontSizes.xl,
  backgroundColor: vars.colors.red[5],
  color: vars.colors.white,
  padding: vars.spacing.md,
  borderRadius: vars.radius.lg,

  '@media': {
    [vars.largerThan(768)]: {
      fontSize: rem(18),
      padding: vars.spacing.lg,
    },
    
    [vars.smallerThan(640)]: {
      fontSize: vars.fontSizes.xs,
      padding: vars.spacing.sm,
    },
  },

  selectors: {
    [vars.darkSelector]: {
      backgroundColor: vars.colors.blue[5],
      color: vars.colors.white,
    },
    
    [vars.rtlSelector]: {
      paddingLeft: vars.spacing.md,
      paddingRight: 0,
    },
  },
});

export const glassmorphismCard = style({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(16px)',
  border: `1px solid rgba(255, 255, 255, 0.2)`,
  borderRadius: vars.radius.xl,
  padding: vars.spacing.lg,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',

  selectors: {
    [vars.darkSelector]: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
  },
});

export const responsiveGrid = style({
  display: 'grid',
  gap: vars.spacing.md,
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',

  '@media': {
    [vars.largerThan('sm')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: vars.spacing.lg,
    },
    
    [vars.largerThan('lg')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: vars.spacing.xl,
    },
  },
});

export const propertyCard = style({
  backgroundColor: vars.colors.white,
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: `1px solid ${vars.colors.gray[2]}`,
  
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
  },

  selectors: {
    [vars.darkSelector]: {
      backgroundColor: vars.colors.gray[8],
      borderColor: vars.colors.gray[6],
      
      ':hover': {
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
      },
    },
  },
});
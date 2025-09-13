// Button.css.ts
import { style, styleVariants } from '@vanilla-extract/css';
import { rem } from '@mantine/core';
import { vars } from '../../theme.css';

export const buttonBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.md,
  fontSize: vars.fontSizes.sm,
  fontWeight: '500',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  border: 'none',
  textDecoration: 'none',
  outline: 'none',
  
  ':focus': {
    outline: `2px solid ${vars.colors.blue[5]}`,
    outlineOffset: '2px',
  },
  
  ':disabled': {
    pointerEvents: 'none',
    opacity: 0.5,
  },

  selectors: {
    [vars.darkSelector]: {
      color: vars.colors.white,
    },
  },
});

export const buttonVariants = styleVariants({
  default: {
    backgroundColor: vars.colors.blue[6],
    color: vars.colors.white,
    
    ':hover': {
      backgroundColor: vars.colors.blue[7],
    },

    selectors: {
      [vars.darkSelector]: {
        backgroundColor: vars.colors.blue[5],
        
        ':hover': {
          backgroundColor: vars.colors.blue[4],
        },
      },
    },
  },
  
  destructive: {
    backgroundColor: vars.colors.red[6],
    color: vars.colors.white,
    
    ':hover': {
      backgroundColor: vars.colors.red[7],
    },

    selectors: {
      [vars.darkSelector]: {
        backgroundColor: vars.colors.red[5],
        
        ':hover': {
          backgroundColor: vars.colors.red[4],
        },
      },
    },
  },
  
  outline: {
    border: `1px solid ${vars.colors.gray[3]}`,
    backgroundColor: 'transparent',
    color: vars.colors.gray[9],
    
    ':hover': {
      backgroundColor: vars.colors.gray[1],
    },

    selectors: {
      [vars.darkSelector]: {
        borderColor: vars.colors.gray[6],
        color: vars.colors.gray[1],
        
        ':hover': {
          backgroundColor: vars.colors.gray[8],
        },
      },
    },
  },
  
  secondary: {
    backgroundColor: vars.colors.gray[2],
    color: vars.colors.gray[9],
    
    ':hover': {
      backgroundColor: vars.colors.gray[3],
    },

    selectors: {
      [vars.darkSelector]: {
        backgroundColor: vars.colors.gray[7],
        color: vars.colors.gray[1],
        
        ':hover': {
          backgroundColor: vars.colors.gray[6],
        },
      },
    },
  },
  
  ghost: {
    backgroundColor: 'transparent',
    color: vars.colors.gray[9],
    
    ':hover': {
      backgroundColor: vars.colors.gray[1],
    },

    selectors: {
      [vars.darkSelector]: {
        color: vars.colors.gray[1],
        
        ':hover': {
          backgroundColor: vars.colors.gray[8],
        },
      },
    },
  },
  
  link: {
    backgroundColor: 'transparent',
    color: vars.colors.blue[6],
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
    
    ':hover': {
      textDecoration: 'none',
    },

    selectors: {
      [vars.darkSelector]: {
        color: vars.colors.blue[4],
      },
    },
  },
});

export const buttonSizes = styleVariants({
  default: {
    height: rem(40),
    paddingLeft: vars.spacing.md,
    paddingRight: vars.spacing.md,
  },
  
  sm: {
    height: rem(36),
    paddingLeft: vars.spacing.sm,
    paddingRight: vars.spacing.sm,
    fontSize: vars.fontSizes.xs,
  },
  
  lg: {
    height: rem(44),
    paddingLeft: vars.spacing.lg,
    paddingRight: vars.spacing.lg,
    fontSize: vars.fontSizes.lg,
  },
  
  icon: {
    height: rem(40),
    width: rem(40),
    padding: 0,
  },
});
import React, { CSSProperties } from 'react';
import { z } from 'zod';

const COLOR_SCHEMA = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/)
  .nullable()
  .optional();

const PADDING_SCHEMA = z
  .object({
    top: z.number(),
    bottom: z.number(),
    right: z.number(),
    left: z.number(),
  })
  .optional()
  .nullable();

const getPadding = (padding: z.infer<typeof PADDING_SCHEMA>) =>
  padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined;

const FONT_FAMILY_SCHEMA = z
  .enum([
    'MODERN_SANS',
    'BOOK_SANS',
    'ORGANIC_SANS',
    'GEOMETRIC_SANS',
    'HEAVY_SANS',
    'ROUNDED_SANS',
    'MODERN_SERIF',
    'BOOK_SERIF',
    'MONOSPACE',
  ])
  .nullable()
  .optional();

function getFontFamily(fontFamily: z.infer<typeof FONT_FAMILY_SCHEMA>) {
  switch (fontFamily) {
    case 'MODERN_SANS':
      return '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif';
    case 'BOOK_SANS':
      return 'Optima, Candara, "Noto Sans", source-sans-pro, sans-serif';
    case 'ORGANIC_SANS':
      return 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif';
    case 'GEOMETRIC_SANS':
      return 'Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif';
    case 'HEAVY_SANS':
      return 'Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif';
    case 'ROUNDED_SANS':
      return 'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif';
    case 'MODERN_SERIF':
      return 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif';
    case 'BOOK_SERIF':
      return '"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif';
    case 'MONOSPACE':
      return '"Nimbus Mono PS", "Courier New", "Cutive Mono", monospace';
  }
  return undefined;
}

export const HeadingPropsSchema = z.object({
  props: z
    .object({
      text: z.string().optional().nullable(),
      level: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).optional().nullable(),
    })
    .optional()
    .nullable(),
  style: z
    .object({
      color: COLOR_SCHEMA,
      backgroundColor: COLOR_SCHEMA,
      fontFamily: FONT_FAMILY_SCHEMA,
      fontWeight: z.enum(['bold', 'normal']).optional().nullable(),
      fontStyle: z.enum(['normal', 'italic']).optional().nullable(),
      textAlign: z.enum(['left', 'center', 'right', 'justify']).optional().nullable(),
      textDecoration: z.string().optional().nullable(),
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
});

export type HeadingProps = z.infer<typeof HeadingPropsSchema>;

export const HeadingPropsDefaults = {
  level: 'h2',
  text: '',
} as const;

export function Heading({ props, style }: HeadingProps) {
  const level = props?.level ?? HeadingPropsDefaults.level;
  const text = props?.text ?? HeadingPropsDefaults.text;
  const hStyle: CSSProperties = {
    color: style?.color ?? undefined,
    backgroundColor: style?.backgroundColor ?? undefined,
    fontWeight: style?.fontWeight ?? 'bold',
    fontStyle: style?.fontStyle ?? undefined,
    textAlign: style?.textAlign ?? undefined,
    textDecoration: style?.textDecoration ?? undefined,
    margin: 0,
    fontFamily: getFontFamily(style?.fontFamily),
    fontSize: getFontSize(level),
    padding: getPadding(style?.padding),
  };
  switch (level) {
    case 'h1':
      return <h1 style={hStyle}>{text}</h1>;
    case 'h2':
      return <h2 style={hStyle}>{text}</h2>;
    case 'h3':
      return <h3 style={hStyle}>{text}</h3>;
    case 'h4':
      return <h4 style={hStyle}>{text}</h4>;
    case 'h5':
      return <h5 style={hStyle}>{text}</h5>;
    case 'h6':
      return <h6 style={hStyle}>{text}</h6>;
  }
}

function getFontSize(level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  switch (level) {
    case 'h1':
      return 32;
    case 'h2':
      return 24;
    case 'h3':
      return 20;
    case 'h4':
      return 18;
    case 'h5':
      return 16;
    case 'h6':
      return 14;
  }
}

/**
 * Converts a hex color string to rgba format
 * @param hex - Hex color string (e.g., "#FF0000")
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string (e.g., "rgba(255, 0, 0, 0.5)")
 */
export function hexToRgba(hex: string, opacity: number): string {
  // Remove the # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Constructs a box-shadow CSS string from shadow properties
 * @param shadowColor - Hex color string (e.g., "#000000")
 * @param shadowSize - Shadow blur radius in pixels
 * @param shadowOpacity - Shadow opacity between 0 and 1
 * @returns Box-shadow CSS string or undefined if shadowColor is null/undefined
 */
export function buildBoxShadow(
  shadowColor: string | null | undefined,
  shadowSize: number | null | undefined,
  shadowOpacity: number | null | undefined
): string | undefined {
  if (!shadowColor) {
    return undefined;
  }
  
  const size = shadowSize ?? 16;
  const opacity = shadowOpacity ?? 0.15;
  const rgbaColor = hexToRgba(shadowColor, opacity);
  
  // Box shadow format: offset-x offset-y blur-radius color
  // Using 0 2px for a subtle drop shadow effect
  return `0 2px ${size}px ${rgbaColor}`;
}


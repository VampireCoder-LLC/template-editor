import React, { useState } from 'react';

import {
  FormatAlignCenterOutlined,
  FormatAlignJustifyOutlined,
  FormatAlignLeftOutlined,
  FormatAlignRightOutlined,
  FormatBoldOutlined,
  FormatItalicOutlined,
  FormatStrikethroughOutlined,
  FormatUnderlinedOutlined,
  MoreVertOutlined,
  PaletteOutlined,
  ExpandOutlined,
  HeightOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignCenterOutlined,
  VerticalAlignBottomOutlined,
  TuneOutlined,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  SxProps,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';

import { TStyle } from '../../helpers/TStyle';
import { TEditorBlock } from '../../../editor/core';
import { NullableFontFamily } from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/FontFamily';
import TextDecorationInput from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/TextDecorationInput';
import PaddingInput from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/PaddingInput';
import Picker from '../../../../App/InspectorDrawer/ConfigurationPanel/input-panels/helpers/inputs/ColorInput/Picker';
import { setDocument, useDocument } from '../../../editor/EditorContext';

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

const getToolbarSx = (isBelow: boolean, top: number, left: number): SxProps => ({
  position: 'fixed',
  top: isBelow ? `${top + 8}px` : `${top - 60}px`,
  left: `${left}px`,
  transform: 'translateX(-50%)',
  zIndex: 'fab',
  padding: 1,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  borderRadius: 1,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 1,
  height: '40px',
});

type Props = {
  blockId: string;
  style: TStyle | null | undefined;
  isFirstChild?: boolean;
};

// Helper function to determine if a block type supports color properties
function supportsColorProperties(blockType: string): boolean {
  const colorSupportedTypes = ['Text', 'Heading', 'Button', 'Html', 'Avatar', 'Image', 'Divider'];
  return colorSupportedTypes.includes(blockType);
}

// Helper function to determine if a block type should show general style controls
function supportsGeneralStyleControls(blockType: string): boolean {
  const noStyleControlTypes = ['Spacer', 'Divider'];
  return !noStyleControlTypes.includes(blockType);
}

// Helper function to determine if a block type supports font controls
function supportsFontControls(blockType: string): boolean {
  const fontSupportedTypes = ['Text', 'Heading', 'Button', 'Html'];
  return fontSupportedTypes.includes(blockType);
}

export default function StyleToolbar({ blockId, style, isFirstChild }: Props) {
  const document = useDocument();
  const block = document[blockId] as TEditorBlock;
  const [paddingAnchorEl, setPaddingAnchorEl] = useState<null | HTMLElement>(null);
  const [textColorAnchorEl, setTextColorAnchorEl] = useState<null | HTMLElement>(null);
  const [bgColorAnchorEl, setBgColorAnchorEl] = useState<null | HTMLElement>(null);
  const [buttonControlsAnchorEl, setButtonControlsAnchorEl] = useState<null | HTMLElement>(null);
  const [buttonBgColorAnchorEl, setButtonBgColorAnchorEl] = useState<null | HTMLElement>(null);
  const [imageAlignmentAnchorEl, setImageAlignmentAnchorEl] = useState<null | HTMLElement>(null);
  const [isBelow, setIsBelow] = useState(false);
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const handleStyleChange = (updatedStyle: TStyle) => {
    setDocument({
      [blockId]: {
        ...block,
        data: {
          ...block.data,
          style: updatedStyle,
        },
      },
    });
  };

  const handlePaddingClick = (event: React.MouseEvent<HTMLElement>) => {
    setPaddingAnchorEl(event.currentTarget);
  };

  const handlePaddingClose = () => {
    setPaddingAnchorEl(null);
  };

  const handleTextColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setTextColorAnchorEl(event.currentTarget);
  };

  const handleTextColorClose = () => {
    setTextColorAnchorEl(null);
  };

  const handleBgColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setBgColorAnchorEl(event.currentTarget);
  };

  const handleBgColorClose = () => {
    setBgColorAnchorEl(null);
  };

  const handleButtonControlsClick = (event: React.MouseEvent<HTMLElement>) => {
    setButtonControlsAnchorEl(event.currentTarget);
  };

  const handleButtonControlsClose = () => {
    setButtonControlsAnchorEl(null);
  };

  const handleButtonBgColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setButtonBgColorAnchorEl(event.currentTarget);
  };

  const handleButtonBgColorClose = () => {
    setButtonBgColorAnchorEl(null);
  };

  const handleImageAlignmentClick = (event: React.MouseEvent<HTMLElement>) => {
    setImageAlignmentAnchorEl(event.currentTarget);
  };

  const handleImageAlignmentClose = () => {
    setImageAlignmentAnchorEl(null);
  };

  // Check if toolbar should be positioned below the element
  const [toolbarPosition, setToolbarPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    const checkPosition = () => {
      if (parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        // If this is the first child, always show toolbar below. Otherwise, show above
        setIsBelow(isFirstChild ?? false);
        // Calculate fixed position relative to viewport
        setToolbarPosition({
          top: rect.top + window.scrollY,
          left: rect.left + rect.width / 2 + window.scrollX,
        });
      }
    };

    checkPosition();
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);

    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, [isFirstChild]);

  const handlePropsChange = (updatedProps: any) => {
    setDocument({
      [blockId]: {
        ...block,
        data: {
          ...block.data,
          props: updatedProps,
        },
      },
    });
  };

  const currentFontSize = style?.fontSize ?? 16;
  const currentTextAlign = style?.textAlign ?? 'left';
  const isBold = style?.fontWeight === 'bold';
  const supportsColors = supportsColorProperties(block.type);
  const supportsFonts = supportsFontControls(block.type);

  const showGeneralControls = supportsGeneralStyleControls(block.type);

  return (
    <Box ref={parentRef}>
      <Paper ref={toolbarRef} sx={getToolbarSx(isBelow, toolbarPosition.top, toolbarPosition.left)} onClick={(ev) => ev.stopPropagation()}>
      {/* General Style Controls - Hidden for Spacer */}
      {showGeneralControls && (
        <>
          {/* Font Controls - Hidden for Image */}
          {supportsFonts && (
            <>
              {/* Font Family */}
              <Box sx={{ width: '140px' }}>
                <NullableFontFamily
                  label=""
                  defaultValue={style?.fontFamily ?? null}
                  onChange={(fontFamily) => handleStyleChange({ ...style, fontFamily })}
                />
              </Box>

              <Divider orientation="vertical" flexItem />

              {/* Font Size - Not for Heading blocks */}
              {block.type !== 'Heading' && (
                <>
                  <TextField
                    select
                    size="small"
                    variant="standard"
                    value={currentFontSize}
                    onChange={(e) => handleStyleChange({ ...style, fontSize: parseInt(e.target.value) })}
                    sx={{ width: '70px' }}
                    InputProps={{ style: { fontSize: '12px' } }}
                  >
                    {FONT_SIZES.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}

              {/* Heading Level Control - Only for Heading blocks */}
              {block.type === 'Heading' && (
                <>
                  <TextField
                    select
                    size="small"
                    variant="standard"
                    value={block.data?.props?.level ?? 'h2'}
                    onChange={(e) => {
                      handlePropsChange({
                        ...block.data?.props,
                        level: e.target.value,
                      });
                    }}
                    sx={{ width: '70px' }}
                    InputProps={{ style: { fontSize: '12px' } }}
                  >
                    <MenuItem value="h1" sx={{ fontSize: '32px', fontWeight: 'bold' }}>H1</MenuItem>
                    <MenuItem value="h2" sx={{ fontSize: '24px', fontWeight: 'bold' }}>H2</MenuItem>
                    <MenuItem value="h3" sx={{ fontSize: '20px', fontWeight: 'bold' }}>H3</MenuItem>
                    <MenuItem value="h4" sx={{ fontSize: '18px', fontWeight: 'bold' }}>H4</MenuItem>
                    <MenuItem value="h5" sx={{ fontSize: '16px', fontWeight: 'bold' }}>H5</MenuItem>
                    <MenuItem value="h6" sx={{ fontSize: '14px', fontWeight: 'bold' }}>H6</MenuItem>
                  </TextField>
                </>
              )}

              <Divider orientation="vertical" flexItem />

              {/* Font Weight (Bold only) */}
              <Tooltip title="Bold">
                <IconButton
                  size="small"
                  onClick={() => handleStyleChange({ ...style, fontWeight: isBold ? 'normal' : 'bold' })}
                  sx={{
                    color: isBold ? 'primary.main' : 'inherit',
                    backgroundColor: isBold ? 'action.selected' : 'transparent',
                  }}
                >
                  <FormatBoldOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Text Decoration */}
              <Tooltip title="Italic">
                <IconButton
                  size="small"
                  onClick={() => {
                    const isItalic = style?.fontStyle === 'italic';
                    handleStyleChange({ ...style, fontStyle: isItalic ? 'normal' : 'italic' });
                  }}
                  sx={{
                    color: style?.fontStyle === 'italic' ? 'primary.main' : 'inherit',
                    backgroundColor: style?.fontStyle === 'italic' ? 'action.selected' : 'transparent',
                  }}
                >
                  <FormatItalicOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Underline">
                <IconButton
                  size="small"
                  onClick={() => {
                    const hasUnderline = style?.textDecoration?.includes('underline');
                    const decorations: string[] = [];
                    if (hasUnderline) {
                      // Remove underline
                      if (style?.textDecoration?.includes('line-through')) {
                        decorations.push('line-through');
                      }
                    } else {
                      // Add underline
                      if (style?.textDecoration?.includes('line-through')) {
                        decorations.push('line-through');
                      }
                      decorations.push('underline');
                    }
                    const textDecoration = decorations.length > 0 ? decorations.join(' ') : null;
                    handleStyleChange({ ...style, textDecoration });
                  }}
                  sx={{
                    color: style?.textDecoration?.includes('underline') ? 'primary.main' : 'inherit',
                    backgroundColor: style?.textDecoration?.includes('underline') ? 'action.selected' : 'transparent',
                  }}
                >
                  <FormatUnderlinedOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Strikethrough">
                <IconButton
                  size="small"
                  onClick={() => {
                    const hasStrikethrough = style?.textDecoration?.includes('line-through');
                    const decorations: string[] = [];
                    if (hasStrikethrough) {
                      // Remove strikethrough
                      if (style?.textDecoration?.includes('underline')) {
                        decorations.push('underline');
                      }
                    } else {
                      // Add strikethrough
                      if (style?.textDecoration?.includes('underline')) {
                        decorations.push('underline');
                      }
                      decorations.push('line-through');
                    }
                    const textDecoration = decorations.length > 0 ? decorations.join(' ') : null;
                    handleStyleChange({ ...style, textDecoration });
                  }}
                  sx={{
                    color: style?.textDecoration?.includes('line-through') ? 'primary.main' : 'inherit',
                    backgroundColor: style?.textDecoration?.includes('line-through') ? 'action.selected' : 'transparent',
                  }}
                >
                  <FormatStrikethroughOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem />
            </>
          )}

          {/* Text Alignment */}
          <ToggleButtonGroup
            value={currentTextAlign}
            exclusive
            onChange={(_, newAlign) => {
              if (newAlign !== null) {
                handleStyleChange({ ...style, textAlign: newAlign });
              }
            }}
            size="small"
            sx={{ height: '32px' }}
          >
            <Tooltip title="Align Left">
              <ToggleButton value="left">
                <FormatAlignLeftOutlined fontSize="small" />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Align Center">
              <ToggleButton value="center">
                <FormatAlignCenterOutlined fontSize="small" />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Align Right">
              <ToggleButton value="right">
                <FormatAlignRightOutlined fontSize="small" />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Justify">
              <ToggleButton value="justify">
                <FormatAlignJustifyOutlined fontSize="small" />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          {/* Color Controls */}
          {supportsColors && (
            <>
              <Tooltip title="Text Color">
                <IconButton
                  size="small"
                  onClick={handleTextColorClick}
                  sx={{
                    backgroundColor: style?.color ? style.color : 'transparent',
                    border: '1px solid',
                    borderColor: 'divider',
                    width: '28px',
                    height: '28px',
                  }}
                >
                  <PaletteOutlined fontSize="small" sx={{ color: style?.color ? '#fff' : 'inherit' }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Background Color">
                <IconButton
                  size="small"
                  onClick={handleBgColorClick}
                  sx={{
                    backgroundColor: style?.backgroundColor ? style.backgroundColor : 'transparent',
                    border: '1px solid',
                    borderColor: 'divider',
                    width: '28px',
                    height: '28px',
                  }}
                >
                  <PaletteOutlined fontSize="small" sx={{ color: style?.backgroundColor ? '#fff' : 'inherit' }} />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem />
            </>
          )}

          {/* Padding Menu */}
          <Tooltip title="Padding">
            <IconButton size="small" onClick={handlePaddingClick}>
              <MoreVertOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Popover
            open={Boolean(paddingAnchorEl)}
            anchorEl={paddingAnchorEl}
            onClose={handlePaddingClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                minWidth: '350px',
                p: 3,
              },
            }}
          >
            <PaddingInput
              label="Padding"
              defaultValue={style?.padding ?? null}
              onChange={(padding) => {
                handleStyleChange({ ...style, padding });
              }}
            />
          </Popover>
        </>
      )}

      {/* Text Color Picker */}
      <Popover
        open={Boolean(textColorAnchorEl)}
        anchorEl={textColorAnchorEl}
        onClose={handleTextColorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Picker
          value={style?.color ?? '#000000'}
          onChange={(color) => {
            handleStyleChange({ ...style, color });
          }}
        />
      </Popover>

      {/* Background Color Picker */}
      <Popover
        open={Boolean(bgColorAnchorEl)}
        anchorEl={bgColorAnchorEl}
        onClose={handleBgColorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Picker
          value={style?.backgroundColor ?? '#FFFFFF'}
          onChange={(backgroundColor) => {
            handleStyleChange({ ...style, backgroundColor });
          }}
        />
      </Popover>

      {/* Type-Specific Controls */}
      {block.type === 'Button' && (
        <>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Button Settings">
            <IconButton size="small" onClick={handleButtonControlsClick}>
              <TuneOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Popover
            open={Boolean(buttonControlsAnchorEl)}
            anchorEl={buttonControlsAnchorEl}
            onClose={handleButtonControlsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                minWidth: '300px',
                p: 2,
              },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Button Width */}
              <Box>
                <Box sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Width</Box>
                <ToggleButtonGroup
                  value={block.data?.props?.fullWidth ? 'full' : 'auto'}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      handlePropsChange({
                        ...block.data?.props,
                        fullWidth: newValue === 'full',
                      });
                    }
                  }}
                  size="small"
                  fullWidth
                >
                  <ToggleButton value="auto">Auto</ToggleButton>
                  <ToggleButton value="full">Full</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Button Size */}
              <Box>
                <Box sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Size</Box>
                <ToggleButtonGroup
                  value={block.data?.props?.size ?? 'medium'}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      handlePropsChange({
                        ...block.data?.props,
                        size: newValue,
                      });
                    }
                  }}
                  size="small"
                  fullWidth
                >
                  <ToggleButton value="x-small">Xs</ToggleButton>
                  <ToggleButton value="small">Sm</ToggleButton>
                  <ToggleButton value="medium">Md</ToggleButton>
                  <ToggleButton value="large">Lg</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Button Style */}
              <Box>
                <Box sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Style</Box>
                <ToggleButtonGroup
                  value={block.data?.props?.buttonStyle ?? 'rounded'}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      handlePropsChange({
                        ...block.data?.props,
                        buttonStyle: newValue,
                      });
                    }
                  }}
                  size="small"
                  fullWidth
                >
                  <ToggleButton value="rectangle">Rect</ToggleButton>
                  <ToggleButton value="rounded">Round</ToggleButton>
                  <ToggleButton value="pill">Pill</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Button Background Color */}
              <Box>
                <Box sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>Button Color</Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={handleButtonBgColorClick}
                    sx={{
                      backgroundColor: block.data?.props?.buttonBackgroundColor ?? '#999999',
                      border: '1px solid',
                      borderColor: 'divider',
                      width: '36px',
                      height: '36px',
                    }}
                  />
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {block.data?.props?.buttonBackgroundColor ?? '#999999'}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Popover>

          {/* Button Background Color Picker Popover */}
          <Popover
            open={Boolean(buttonBgColorAnchorEl)}
            anchorEl={buttonBgColorAnchorEl}
            onClose={handleButtonBgColorClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Picker
              value={block.data?.props?.buttonBackgroundColor ?? '#999999'}
              onChange={(buttonBackgroundColor) => {
                handlePropsChange({
                  ...block.data?.props,
                  buttonBackgroundColor,
                });
              }}
            />
          </Popover>
        </>
      )}

      {/* Image Alignment Controls */}
      {block.type === 'Image' && (
        <>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Image Alignment">
            <IconButton size="small" onClick={handleImageAlignmentClick}>
              <ExpandOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Popover
            open={Boolean(imageAlignmentAnchorEl)}
            anchorEl={imageAlignmentAnchorEl}
            onClose={handleImageAlignmentClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                minWidth: '200px',
                p: 2,
              },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Alignment</Box>
              <ToggleButtonGroup
                value={block.data?.props?.contentAlignment ?? 'middle'}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    handlePropsChange({
                      ...block.data?.props,
                      contentAlignment: newValue,
                    });
                  }
                }}
                size="small"
                fullWidth
              >
                <Tooltip title="Top">
                  <ToggleButton value="top">
                    <VerticalAlignTopOutlined fontSize="small" />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title="Middle">
                  <ToggleButton value="middle">
                    <VerticalAlignCenterOutlined fontSize="small" />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title="Bottom">
                  <ToggleButton value="bottom">
                    <VerticalAlignBottomOutlined fontSize="small" />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            </Box>
          </Popover>
        </>
      )}

      {/* Spacer Height Control */}
      {block.type === 'Spacer' && (
        <>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Height">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
              <HeightOutlined fontSize="small" />
              <TextField
                type="number"
                size="small"
                value={block.data?.props?.height ?? 16}
                onChange={(e) => {
                  const height = Math.max(0, parseInt(e.target.value) || 0);
                  handlePropsChange({
                    ...block.data?.props,
                    height,
                  });
                }}
                inputProps={{ min: 0, step: 4, style: { width: '50px', textAlign: 'center' } }}
                sx={{ '& input': { fontSize: '0.875rem' } }}
              />
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>px</Box>
            </Box>
          </Tooltip>
        </>
      )}

      {/* Divider Controls */}
      {block.type === 'Divider' && (
        <>
          <Divider orientation="vertical" flexItem />

          {/* Line Color */}
          <Tooltip title="Color">
            <IconButton
              size="small"
              onClick={(e) => setTextColorAnchorEl(e.currentTarget)}
              sx={{
                backgroundColor: block.data?.props?.lineColor ?? '#333333',
                width: '24px',
                height: '24px',
                '&:hover': {
                  backgroundColor: block.data?.props?.lineColor ?? '#333333',
                },
              }}
            />
          </Tooltip>

          <Popover
            open={Boolean(textColorAnchorEl)}
            anchorEl={textColorAnchorEl}
            onClose={() => setTextColorAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Picker
              value={block.data?.props?.lineColor ?? '#333333'}
              onChange={(lineColor) => {
                handlePropsChange({
                  ...block.data?.props,
                  lineColor,
                });
              }}
            />
          </Popover>

          {/* Line Height */}
          <Tooltip title="Height">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
              <HeightOutlined fontSize="small" />
              <TextField
                type="number"
                size="small"
                value={block.data?.props?.lineHeight ?? 1}
                onChange={(e) => {
                  const lineHeight = Math.max(1, parseInt(e.target.value) || 1);
                  handlePropsChange({
                    ...block.data?.props,
                    lineHeight,
                  });
                }}
                inputProps={{ min: 1, max: 24, style: { width: '40px', textAlign: 'center' } }}
                sx={{ '& input': { fontSize: '0.875rem' } }}
              />
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>px</Box>
            </Box>
          </Tooltip>

          {/* Background Color */}
          <Tooltip title="Background color">
            <IconButton
              size="small"
              onClick={(e) => setBgColorAnchorEl(e.currentTarget)}
              sx={{
                backgroundColor: style?.backgroundColor ?? '#FFFFFF',
                width: '24px',
                height: '24px',
                border: '1px solid #ccc',
                '&:hover': {
                  backgroundColor: style?.backgroundColor ?? '#FFFFFF',
                },
              }}
            />
          </Tooltip>

          <Popover
            open={Boolean(bgColorAnchorEl)}
            anchorEl={bgColorAnchorEl}
            onClose={() => setBgColorAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Picker
              value={style?.backgroundColor ?? '#FFFFFF'}
              onChange={(backgroundColor) => {
                handleStyleChange({ ...style, backgroundColor });
              }}
            />
          </Popover>

          {/* Padding */}
          <Tooltip title="Padding">
            <IconButton
              size="small"
              onClick={(e) => setPaddingAnchorEl(e.currentTarget)}
              sx={{ color: 'text.primary' }}
            >
              <MoreVertOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Popover
            open={Boolean(paddingAnchorEl)}
            anchorEl={paddingAnchorEl}
            onClose={() => setPaddingAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                minWidth: '350px',
                p: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <PaddingInput
              label="Padding"
              defaultValue={style?.padding ?? null}
              onChange={(padding) => handleStyleChange({ ...style, padding })}
            />
          </Popover>
        </>
      )}

      </Paper>
    </Box>
  );
}


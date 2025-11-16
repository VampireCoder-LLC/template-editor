import React from 'react';

import {
  Crop32Outlined,
  HMobiledataOutlined,
  HorizontalRuleOutlined,
  HtmlOutlined,
  ImageOutlined,
  LibraryAddOutlined,
  NotesOutlined,
  SmartButtonOutlined,
  ViewColumnOutlined,
} from '@mui/icons-material';

import { TEditorBlock } from '../../../../editor/core';

type TButtonProps = {
  label: string;
  icon: JSX.Element;
  genBlock: () => TEditorBlock;
};
export const BUTTONS: TButtonProps[] = [
  {
    label: 'Container',
    icon: <LibraryAddOutlined />,
    genBlock: () => ({
      type: 'Container',
      data: {
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Columns',
    icon: <ViewColumnOutlined />,
    genBlock: () => ({
      type: 'ColumnsContainer',
      data: {
        props: {
          columnsGap: 16,
          columnsCount: 3,
          columns: [{ childrenIds: [] }, { childrenIds: [] }, { childrenIds: [] }],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'HTML',
    icon: <HtmlOutlined />,
    genBlock: () => ({
      type: 'Html',
      data: {
        props: { contents: '<strong>Hello world</strong>' },
        style: {
          fontSize: 16,
          textAlign: null,
          padding: { top: 16, bottom: 16, left: 24, right: 24 },
        },
      },
    }),
  },
  {
    label: 'Heading',
    icon: <HMobiledataOutlined />,
    genBlock: () => ({
      type: 'Heading',
      data: {
        props: { text: 'Hello friend' },
        style: {
          padding: { top: 16, bottom: 16, left: 24, right: 24 },
        },
      },
    }),
  },
  {
    label: 'Text',
    icon: <NotesOutlined />,
    genBlock: () => ({
      type: 'Text',
      data: {
        props: { text: 'My new text block' },
        style: {
          padding: { top: 16, bottom: 16, left: 24, right: 24 },
          fontWeight: 'normal',
        },
      },
    }),
  },
  {
    label: 'Image',
    icon: <ImageOutlined />,
    genBlock: () => ({
      type: 'Image',
      data: {
        props: {
          url: 'https://assets.vampirecoder.com/sample-image.jpg',
          alt: 'Sample product',
          contentAlignment: 'middle',
          linkHref: null,
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Button',
    icon: <SmartButtonOutlined />,
    genBlock: () => ({
      type: 'Button',
      data: {
        props: {
          text: 'Button',
          url: 'https://www.vampirecoder.com',
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    label: 'Spacer',
    icon: <Crop32Outlined />,
    genBlock: () => ({
      type: 'Spacer',
      data: {},
    }),
  },
  {
    label: 'Divider',
    icon: <HorizontalRuleOutlined />,
    genBlock: () => ({
      type: 'Divider',
      data: {
        style: { padding: { top: 16, right: 0, bottom: 16, left: 0 } },
        props: {
          lineColor: '#CCCCCC',
        },
      },
    }),
  },

  // { label: 'ProgressBar', icon: <ProgressBarOutlined />, genBlock: () => ({}) },
  // { label: 'LoopContainer', icon: <ViewListOutlined />, genBlock: () => ({}) },
];

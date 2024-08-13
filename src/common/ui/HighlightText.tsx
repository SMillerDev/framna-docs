"use client"
import React from "react"
import { SxProps, Typography, TypographyVariant } from "@mui/material"
import styled from "@emotion/styled"

type CustomTypographyVariant = TypographyVariant | 'body0' | 'body3';

interface HighlightTextProps {
  content: string
  highlight: string
  color: string
  height?: string
  isSolidOpacity?: boolean
  isBoldText?: boolean
  variant?: CustomTypographyVariant
  sx?: SxProps
}

const HighlightSpan = styled.span<{
    color: string; isSolidOpacity: boolean; height: string; isBoldText: boolean 
  }>`
  position: relative;
  display: inline-block;
  ${({ isBoldText }) => isBoldText && "font-weight: 600"};
  &::before {
    content: '';
    position: absolute;
    left: -1%;
    bottom: 0;
    height: ${({ height }) => height};
    width: 102%;
    background-color: ${({ color }) => color};
    z-index: -10;
    opacity: ${({ isSolidOpacity }) => isSolidOpacity ? .7 : .3};
    transform: skewX(-2deg);
  }
}`;

const HighlightText = ({
  content,
  highlight,
  color,
  height="50%",
  isSolidOpacity=false,
  isBoldText=false,
  variant,
  sx
}: HighlightTextProps) => {
  const parts = content.split(new RegExp(`(${highlight})`, 'gi'))

  return (
    <Typography
      variant={variant}
      sx={{
        ...sx,
        display: "inline",
        gap: 1,
      }}
    >
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <HighlightSpan
            key={`highlight-span-${index}`}
            color={color}
            isSolidOpacity={isSolidOpacity}
            height={height}
            isBoldText={isBoldText}>
            {part}
          </HighlightSpan>
        ) : (
          part
        )
      )}
    </Typography>
  );
};

export default HighlightText;

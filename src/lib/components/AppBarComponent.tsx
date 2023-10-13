"use client";

import { Menu } from "@mui/icons-material";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { getProject, getVersion } from "../utils/UrlUtils";
import { Events } from "../events/BaseEvent";
import { subscribe, unsubscribe } from "../utils/EventsUtils";
import ProjectChangedEvent, {
  ProjectChangedEventData,
} from "../events/ProjectChangedEvent";
import { VersionChangedEventData } from "../events/VersionChangedEvent";

interface AppBarComponentProps {
  drawerWidth: number;
  handleDrawerToggle: () => void;
  title: string;
  versionSelectorComponent?: ReactNode;
  openApiSpecificationsComponent?: ReactNode;
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({
  drawerWidth,
  handleDrawerToggle,
  title,
  versionSelectorComponent,
  openApiSpecificationsComponent,
}) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: { sm: "none" },
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
        {versionSelectorComponent ?? <></>}
        {openApiSpecificationsComponent ?? <></>}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;

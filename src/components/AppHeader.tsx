import {
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
} from "@patternfly/react-core";
import type { MenuToggleElement } from "@patternfly/react-core";
import { CarIcon, UserIcon } from "@patternfly/react-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleViewProfile = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleDashboard = () => {
    setIsDropdownOpen(false);
    navigate("/dashboard");
  };

  const onToggleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Masthead>
      <MastheadMain>
        <MastheadBrand
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <CarIcon style={{ marginRight: "0.5rem" }} />
          <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            Drive Log
          </span>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar id="toolbar" isFullHeight isStatic>
          <ToolbarContent>
            <ToolbarGroup align={{ default: "alignEnd" }}>
              <ToolbarItem>
                <Dropdown
                  isOpen={isDropdownOpen}
                  onSelect={() => setIsDropdownOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsDropdownOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={onToggleClick}
                      isExpanded={isDropdownOpen}
                      icon={<UserIcon />}
                    >
                      {user?.name || user?.username}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={handleDashboard}>
                      Dashboard
                    </DropdownItem>
                    <DropdownItem onClick={handleViewProfile}>
                      View Profile
                    </DropdownItem>
                    <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
};

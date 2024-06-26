import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataModal from "./DataModal";
import BookmarkModal from "./BookmarkModal";
import AddHomeModal from "./Addhomemodal";
import UpdateProfileModal from "./UpdateProfileModal";
import DeleteProfileModal from "./DeleteProfileModal";
import config from "../../config";
import "./Sidebar.css";
import "./Modal.css";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const apiUrls = {
  jugendberufshilfen: `${config.backendUrl}/api/data/jugendberufshilfen`,
  kindertageseinrichtungen: `${config.backendUrl}/api/data/kindertageseinrichtungen`,
  schulsozialarbeit: `${config.backendUrl}/api/data/schulsozialarbeit`,
  schulen: `${config.backendUrl}/api/data/schulen`,
};

const fetchBookmarks = async (setBookmarkedItems) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:5000/api/bookmarks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setBookmarkedItems(data.bookmarks);
    } else {
      console.error("Error fetching bookmarks:", data.message);
    }
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
  }
};

function Sidebar() {
  const [dataDropdown, setDataDropdown] = useState(false);
  const [settingsDropdown, setSettingsDropdown] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [user, setUser] = useState(null);
  const [isAddHomeModalOpen, setIsAddHomeModalOpen] = useState(false);
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] =
    useState(false);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] =
    useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchBookmarks(setBookmarkedItems);
  }, []);

  const handleDataClick = async (dataType) => {
    try {
      const response = await fetch(apiUrls[dataType]);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setSelectedData(data.features);
      setIsDataModalOpen(true);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleBookmark = async (item) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Bookmark saved:", data.message);
        fetchBookmarks(setBookmarkedItems);
      } else {
        console.error("Error saving bookmark:", data.message);
      }
    } catch (error) {
      console.error("Error saving bookmark:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="profile">
        <div className="profile-info">
          <h2 className="profile-name">
            {user ? `Hello, ${user.username}` : "Hello, Guest"}
          </h2>
        </div>
      </div>
      <div className="menu">
        <ul className="menu-list">
          <li>
            <a
              href="#"
              className="menu-item"
              onClick={() => setSearchDropdown(!searchDropdown)}
            >
              <TravelExploreIcon className="menu-icon" /> Search
            </a>
            {searchDropdown && (
              <div className="search-dropdown">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search..."
                />
              </div>
            )}
          </li>
          <li>
            <a
              href="#"
              className="menu-item"
              onClick={() => setDataDropdown(!dataDropdown)}
            >
              <DashboardIcon className="menu-icon" /> Data
              {dataDropdown ? (
                <ExpandLessIcon className="expand-icon" />
              ) : (
                <ExpandMoreIcon className="expand-icon" />
              )}
            </a>
            {dataDropdown && (
              <ul className="submenu-list">
                <li>
                  <a
                    href="#"
                    className="submenu-item"
                    onClick={() => handleDataClick("jugendberufshilfen")}
                  >
                    Jugendberufshilfen
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="submenu-item"
                    onClick={() => handleDataClick("kindertageseinrichtungen")}
                  >
                    Kindertageseinrichtungen
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="submenu-item"
                    onClick={() => handleDataClick("schulsozialarbeit")}
                  >
                    Schulsozialarbeit
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="submenu-item"
                    onClick={() => handleDataClick("schulen")}
                  >
                    Schulen
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <a
              href="#"
              className="menu-item"
              onClick={() => setIsBookmarkModalOpen(true)}
            >
              <BookmarkIcon className="menu-icon" /> Saved
            </a>
          </li>
          <li>
            <a
              href="#"
              className="menu-item"
              onClick={() => setSettingsDropdown(!settingsDropdown)}
            >
              <SettingsIcon className="menu-icon" /> Settings
              {settingsDropdown ? (
                <ExpandLessIcon className="expand-icon" />
              ) : (
                <ExpandMoreIcon className="expand-icon" />
              )}
            </a>
            {settingsDropdown && (
              <ul className="submenu-list">
                <li>
                  <a
                    href="#"
                    className="submenu-item"
                    onClick={() => setIsAddHomeModalOpen(true)}
                  >
                    Add home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="submenu-item"
                    onClick={() => setIsUpdateProfileModalOpen(true)}
                  >
                    Update profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="submenu-item"
                    onClick={() => setIsDeleteProfileModalOpen(true)}
                  >
                    Delete profile
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <a href="#" className="menu-item" onClick={handleLogout}>
              <LogoutIcon className="menu-icon" /> Logout
            </a>
          </li>
        </ul>
      </div>
      <AddHomeModal
        isOpen={isAddHomeModalOpen}
        onClose={() => setIsAddHomeModalOpen(false)}
      />
      <UpdateProfileModal
        isOpen={isUpdateProfileModalOpen}
        onClose={() => setIsUpdateProfileModalOpen(false)}
      />
      <DeleteProfileModal
        isOpen={isDeleteProfileModalOpen}
        onClose={() => setIsDeleteProfileModalOpen(false)}
      />
      <DataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        data={selectedData}
        onBookmark={handleBookmark}
      />
      <BookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        bookmarkedItems={bookmarkedItems}
      />
    </div>
  );
}

export default Sidebar;

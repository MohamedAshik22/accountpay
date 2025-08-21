// src/components/UserMenu.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LogOut from "./LogOut";

type Props = {
  userImage?: string | null;
  firstName?: string | null;
};

const UserMenu: React.FC<Props> = ({ userImage, firstName }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const initial = firstName?.charAt(0).toUpperCase() || "?";

  // Close on click outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        open &&
        menuRef.current &&
        btnRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center bg-white rounded-full w-8 h-8 text-blue-600 font-bold text-lg shadow-md hover:text-black focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        {userImage ? (
          <img
            src={userImage}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="User menu"
          className="absolute right-0 mt-2 w-48 rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/5 z-50"
        >
          <Link
            to="/profile"
            role="menuitem"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>

          {/* <Link
            to="/privacy-policy"
            role="menuitem"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Privacy Policy
          </Link> */}

          {/* If your LogOut component renders a button, this will appear as a menu item */}
          <div className="my-1 border-t border-gray-100" />
          <div className="px-2">
          <LogOut className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md" />

          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

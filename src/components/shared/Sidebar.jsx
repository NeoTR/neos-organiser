import React, { useState } from "react";
import ClassNames from "classnames";
import { IoMdSchool, IoMdMenu } from "react-icons/io";
import { DASHBOARD_SIDEBAR_LINKS } from "../../lib/consts/navigation";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const linkClass = "flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-[10px] text-base mt-2";

export default function Sidebar() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  const [sidebarVisible, setSidebarVisible] = useState(isDesktopOrLaptop);

  return (
    <>
      {!sidebarVisible && <IoMdMenu fontSize={24} onClick={() => setSidebarVisible(true)} />}
      {sidebarVisible && (
        <div className="flex flex-col bg-neutral-900 w-60 p-3 text-white">
          <div className="flex items-center gap-2 px-1 py-3">
            <IoMdSchool fontSize={24} />
            <span className="text-neutral-100 text-lg ">Neo's Organiser</span>
          </div>
          <div className="flex-1">
            {DASHBOARD_SIDEBAR_LINKS.map((item) => (
              <SidebarLink key={item.key} item={item} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function SidebarLink({ item }) {
  const { pathname } = useLocation();
  return (
    <Link to={item.path} className={ClassNames(pathname === item.path ? "bg-neutral-700 text-white" : "text-neutral-400", linkClass)}>
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}

import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <div>
        sidebar<div>header</div>
        <div>{<Outlet />}</div>
      </div>
    </div>
  );
}

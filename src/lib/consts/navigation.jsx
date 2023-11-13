import { HiOutlineViewGrid } from "react-icons/hi";
import { TbChecklist } from "react-icons/tb";
import { BsCalendarDate } from "react-icons/bs";
import { FaRegNoteSticky } from "react-icons/fa6";
export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "todo",
    label: "To-Do List",
    path: "/todo",
    icon: <TbChecklist />,
  },
  {
    key: "calender",
    label: "Calender",
    path: "/calender",
    icon: <BsCalendarDate />,
  },
  {
    key: "notes",
    label: "Notes",
    path: "/notes",
    icon: <FaRegNoteSticky />,
  },
];

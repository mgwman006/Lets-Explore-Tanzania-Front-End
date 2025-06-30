import { Outlet } from "react-router-dom";
import NormalizeTrailingSlash from "./NormalizeTrailingSlash";

export default function ToursPage() {
  
  return (
    <div>
      <NormalizeTrailingSlash />
      <Outlet />

    </div>
  );
}
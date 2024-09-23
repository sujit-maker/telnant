import Header from "../admin/Header";
import Sidebar from "../admin/Sidebar";
import UserTable from "./UserTable";

export default function AdminPage() {
  return (
    <>
    <div>
      <Header/>
      <Sidebar/>
       <UserTable/>
    </div>
    </>
  );
}

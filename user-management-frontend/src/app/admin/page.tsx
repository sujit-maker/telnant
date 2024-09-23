import Header from "./Header";
import Sidebar from "./Sidebar";
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

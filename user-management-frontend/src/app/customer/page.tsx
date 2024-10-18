import Sidebar from "../admin/Sidebar";
import Header from "../admin/Header";
import ServiceTable from "./CustomerTable";


export default function CustomerPage() {
  return (
    <>
    <div>
      <Header/>
      <Sidebar/>
       <ServiceTable/>
    </div>
    </>
  );
}

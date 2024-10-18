import Sidebar from "../admin/Sidebar";
import Header from "../admin/Header";
import ServiceTable from "./ServiceTable";


export default function ServicePage() {
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

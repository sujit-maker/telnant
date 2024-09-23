import Sidebar from "../Sidebar";
import Header from "../Header";
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

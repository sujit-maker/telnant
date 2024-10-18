import Header from "../admin/Header";
import Sidebar from "../admin/Sidebar";
import CreateSiteModal from "./CreateSiteModal";
import EditSiteModal from "./EditSiteModal";
import SiteTable from "./SiteTable";


export default function SitePage(){
    return(
        <>

        <Header/>
        <Sidebar/>
        <SiteTable/>
   
        </>
    );                  

}
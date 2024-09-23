import Header from "../Header";
import Sidebar from "../Sidebar";
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
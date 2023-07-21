import React,{useState} from "react"
import { SideNavInfo } from "../dashboard-info/side-nav-info";
import { TopNavInfo } from "../dashboard-info/top-nav-info";
export default function InfoView(){

    const [openNav, setOpenNav] = useState(false);



    return(
        <>  
            <TopNavInfo onNavOpen={() => setOpenNav(true)}/>
            <SideNavInfo  open={openNav} onClose={() => setOpenNav(false)} />
            <h1>Configuracion Individual</h1>
        </>
    )

}
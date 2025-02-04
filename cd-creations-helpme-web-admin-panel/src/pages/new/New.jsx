import "./new.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/nevbar/Navbar"
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined"
import { useState } from "react"

const New = ({inputs, title}) => {

  const[file, setfile] = useState("")

 
  return (
    <div className="new">
      <Sidebar/>
      <div className="newContainer">
        <Navbar/>
       <div className="top">
        <h1>{title}</h1>
       </div>
       <div className="bottom">
        <div className="left">
          <img src={file ? URL.createObjectURL(file) : "https://www.google.com/search?sca_esv=dc237e1a21ded4e7&q=png+image&uds=AMwkrPsm7OC6wr_wb2psDRJUVbCqZsncOWSOVAACNPtDeB6PVj-BIzKBkhM9X0rfv6pBfq2y-qSSLA1Cd0-cZRxNv18KnkHom_Fhkd97EAYo7qSf3X1riu90eKsy3yjBy8N5Ou3jNKIMYAF_KqgOYpIGLF_8UuWZkst3effogrYOqahhad3jzUPtO_rXwH1poxJOqfJkutj2eRQo9TvTTpYQZuoSKzfInkJ3IoEYCS9C245c9RMUKoW6Or67yxQ_iBMl_S4_FfaolKhSjK2V2XU0FoAkHiu4Ag&udm=2&prmd=ivsnbmz&sa=X&sqi=2&ved=2ahUKEwiEo7TjvtCFAxWnfGwGHXwYDW8QtKgLegQIFhAB&biw=1920&bih=945&dpr=1#vhid=F217Z2M-7t3g6M&vssid=mosaic"} alt=""/>
        </div>
        <div className="right">
          <form>
            <div className="formInput">
            
              <label htmlFor="file">
                Image:<DriveFolderUploadOutlinedIcon className="icon"/></label>
              <input type="file"  id="file" onChange={(e) => setfile(e.target.files[0])} style={{display:"none"}}/>
            </div>
            
            { inputs.map((input) =>(
            <div className="formInput" key={input.id}>
              <label>{input.label}</label>
              <input type={input.type} placeholder={input.placeholder}/>
            </div>
            ) )}
            
            <button>Send</button>

          </form>
        </div>
       </div>
      </div>
     </div>
  )
}

export default New

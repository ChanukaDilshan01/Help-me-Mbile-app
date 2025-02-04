export const userColums = [ { field: 'id', headerName: 'ID', width: 70 },
{field:"üser", headerName:"User", width:230,
 renderCell: (params)=>{
    return(
        <div className="cellWithImg">
            <img className="cellImg" src={params.row.img} alt="avatar"/>
            {params.row.username}
        </div>
    )
},
},
{
    field:"email",
    headerName: "Email",
    width:230,
},
{
    field:"age",
    headerName: "Age",
    width:100,
},

]


export const userRows = [
    {
        id:1,
        username:"snow",
        img:"",
        status:"active",
        email:"1snow@gmail.com",
        age:35,
    },
    {
        id:2,
        username:"snow",
        img:"",
        status:"active",
        email:"1snow@gmail.com",
        age:35,
    },
    {
        id:3,
        username:"snow",
        img:"",
        status:"active",
        email:"1snow@gmail.com",
        age:35,
    },
    {
        id:4,
        username:"snow",
        img:"",
        status:"active",
        email:"1snow@gmail.com",
        age:35,
    },
    {
        id:5,
        username:"snow",
        img:"",
        status:"active",
        email:"1snow@gmail.com",
        age:35,
    }
]
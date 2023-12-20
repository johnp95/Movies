import {React,useState,useEffect} from 'react';
import {Box,Button, Typography} from '@mui/material';
import AxiosInstance from './Axios';
import {useNavigate, useParams} from 'react-router-dom'

const Delete = () => {

    const MyParam = useParams()
    const MyId = MyParam.id
    const [myData,setMyData] = useState()
    const [loading,setLoading] = useState(true)
  
    const GetData = () => {
        AxiosInstance.get(`api/movies/${MyId}`).then((res) => {
            setMyData(res.data)
            console.log(res.data)
            setLoading(false)
        })
    }

      useEffect(() => {
        GetData();
    
      },[])
    const navigate = useNavigate()
    const submission = (data) => {

        AxiosInstance.delete(`api/movies/${MyId}/`)
        .then((res) => {
        navigate(`/`)
        })
    }
    return (
    <div>
        { loading ? <p>Loading data...</p> : 
        <div>
            <Box sx={{display:'flex',justifyContent:'space-between',width:'100%',backgroundColor:'#00003f',marginBottom:'10px'}} >
                <Typography sx={{marginLeft: '20px',color:'#fff'}} >
                    Delete Movie: {myData.name}
                </Typography>
            </Box>
            
            <Box sx={{display:'flex',width:'100%',boxShadow:3,padding:4, flexDirection:'column'}}>

                <Box sx={{display:'flex', justifyContent:'start', marginBotom:'40px'}}> 
                    Are you sure that you want to delete: {myData.title} 
                </Box>

                <Box sx={{width:'30%'}}>
                    <Button variant="contained" onClick={submission} sx={{width:'100%'}} >
                        Delete 
                    </Button>
                </Box>
            
            </Box>
        </div> }
    </div>
    )
}

export default Delete
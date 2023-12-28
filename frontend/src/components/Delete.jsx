import { React, useState, useEffect} from 'react';
import { Box, Button, Typography} from '@mui/material';
import AxiosInstance from './Axios';
import { useNavigate, useParams} from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import styles from './styles/deletemodule.module.css';

export const Delete = () => {

    const MyParam = useParams();
    const MyId = MyParam.id;
    const [myData,setMyData] = useState();
    const [loading,setLoading] = useState(true);
  
    const GetData = () => {
        AxiosInstance.get(`api/movies/${MyId}`).then((res) => {
            setMyData(res.data);
            console.log(res.data);
            setLoading(false);
        })
    }
    useEffect(() => {
        GetData();
      },[])
    const navigate = useNavigate();
    const submission = (data) => {
        AxiosInstance.delete(`api/movies/${MyId}/`)
        .then((res) => {
        navigate(`/`)
        })
    }
    return (
    <div className={styles.Container}>
        { loading ? 
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
         : 
        <div>
            <Box className={styles.title}>
                <Typography sx={{color:'#fff'}} >
                    Delete Movie {myData.name}
                </Typography>
            </Box>
        
            <Box sx={{display:'flex',width:'100%',boxShadow:3,padding:4, flexDirection:'column'}}>

                <Box className={styles.text}> 
                    Are you sure that you want to delete: <strong>{myData.title}</strong> 
                </Box>

                <Box className={styles.Container}>
                    <Button 
                    variant="contained" 
                    onClick={submission} 
                    color='error'
                    size='large'>
                        Delete 
                    </Button>
                </Box>
            
            </Box>
        </div> }
    </div>
    )
}

import {React, useEffect, useMemo,useState} from 'react'
import AxiosInstance from './Axios'
import {MaterialReactTable} from 'material-react-table';
import Dayjs from 'dayjs';
import { Box, IconButton } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {Link} from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';

export const Home = () => {

  const [myData,setMyData] = useState()
  const [loading,setLoading] = useState(true)

  const GetData = () => {
    AxiosInstance.get(`api/movies/`).then((res) => {

      setMyData(res.data)
      console.log(res.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    GetData()

  },[])
 
    const columns = useMemo(
      () => [
        {
          accessorKey: 'title', 
          header: 'Title',
          size: 150,
        },
        {
          accessorKey: 'released', 
          header: 'Released',
          size: 150,
        },
        {
          accessorKey: 'director', 
          header: 'Director',
          size: 150,
        },
        {
          accessorKey: 'actor', 
          header: 'Actor',
          size: 150,
        },
        {
          accessorKey: 'actress', 
          header: 'Actress',
          size: 150,
        },
       
        {
          accessorFn: (row) => Dayjs(row.date_watched).format('YYYY-MM-DD'),
          header: 'Date Watched',
          size: 150,
        },
 
      ],
      [],
    );
  
  return (
    <div>
      { loading ? 
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
         : 
        <MaterialReactTable 
          columns={columns}
          data={myData} 
          enableRowActions
          renderRowActions={({row}) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
              <IconButton color="secondary" component={Link} to={`edit/${row.original.id}`}>
                <EditIcon />
              </IconButton>

              <IconButton color="error" component={Link} to={`delete/${row.original.id}`}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
         />
      }
    </div>
  )
}

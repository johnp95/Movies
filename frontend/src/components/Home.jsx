import {React, useEffect, useMemo,useState} from 'react'
import AxiosInstance from './Axios'
import {MaterialReactTable} from 'material-react-table';
import Dayjs from 'dayjs';
import { Box, IconButton } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {Link} from 'react-router-dom'
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
          accessorKey: 'title', //access nested data with dot notation
          header: 'Title',
          size: 150,
        },
        {
          accessorKey: 'director', //access nested data with dot notation
          header: 'Director',
          size: 150,
        },
        {
          accessorKey: 'actor', //access nested data with dot notation
          header: 'Actor',
          size: 150,
        },
        {
          accessorKey: 'actress', //access nested data with dot notation
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
    
        { loading ? <p>Loading data...</p> : 
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

import {React, useEffect} from 'react';
import {Box,Button, Typography} from '@mui/material';
import MyDatePickerField from './forms/MyDatePickerField';
import MyTextField from './forms/MyTextField';
import {useForm} from 'react-hook-form';
import AxiosInstance from './Axios';
import DayJs from 'dayjs'
import {useNavigate, useParams} from 'react-router-dom'

const Edit = () => {

    const MyParam = useParams()
    const MyId = MyParam.id
    const GetData = () => {
        AxiosInstance.get(`add_movie/${MyId}`).then((res) => {
        //   console.log(res.data)
          setValue('title',res.data.title)
          setValue('director',res.data.director)
          setValue('actor',res.data.actor)
          setValue('actress',res.data.actress)
          setValue('date_watched',DayJs(res.data.date_watched))
          setValue('released',res.data.released)
        })
      }
    
      useEffect(() => {
        GetData();
    
      },[])
    const navigate = useNavigate()
    const defaultValues = {
        name: '',
        comments: '',
        status: '',
    }
    const {handleSubmit,setValue, control} = useForm({defaultValues:defaultValues})
    const submission = (data) => {
    const date_watched = DayJs(data.date_watched["$d"]).format('YYYY-MM-DD')

    AxiosInstance.put(`add_movie/${MyId}/`,{
        title: data.title,
        director: data.director,
        actor: data.actor,
        actress: data.actress,
        date_watched: date_watched,
        released: data.released,

    })
    .then((res) => {
      navigate(`/`)
    })
  }
  return (
    <div>
    <form onSubmit={handleSubmit(submission)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '80%', // Adjust the width as needed
            justifyContent: 'center',
            color: 'white',
            padding: 4,
            borderRadius: 8,
            boxShadow: 3,
            marginTop: 'irem'
          }}
        >
          <Typography variant="h6" noWrap component="div" align="center" color="primary">
            Enter Movie
          </Typography>

          <MyTextField
            label="Title"
            name="title"
            control={control}
            placeholder="Provide a title"
          />
          <MyTextField
            label="Director"
            name="director"
            control={control}
            placeholder="Provide a director"
          />
          <MyTextField
            label="Actor"
            name="actor"
            control={control}
            placeholder="Provide an actor"
          />
          <MyTextField
            label="Actress"
            name="actress"
            control={control}
            placeholder="Provide an actress"
          />
          <MyDatePickerField
            label="Date Watched"
            name="date_watched"
            control={control}
          />
          <MyTextField
            label="Released"
            name="released"
            control={control}
            placeholder="Provide released date"
          />

          <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>
            Submit
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default Edit
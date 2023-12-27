import { React, useEffect } from 'react';
import { Box, Button, Typography} from '@mui/material';
import MyDatePickerField from './forms/MyDatePickerField';
import MyTextField from './forms/MyTextField';
import { useForm } from 'react-hook-form';
import AxiosInstance from './Axios';
import Dayjs from 'dayjs'
import { useNavigate, useParams} from 'react-router-dom'
import styles from './styles/editmovie.module.css';

const Edit = () => {

    const MyParam = useParams()
    const MyId = MyParam.id
    const GetData = () => {
        AxiosInstance.get(`api/movies/${MyId}`).then((res) => {
          setValue('title',res.data.title)
          setValue('director',res.data.director)
          setValue('actor',res.data.actor)
          setValue('actress',res.data.actress)
          setValue('date_watched',Dayjs(res.data.date_watched))
          setValue('released',res.data.released)
        })
      }
    
      useEffect(() => {
        GetData();
    
      },[])
    const navigate = useNavigate()
    const defaultValues = {
      title: '',
      director: '',
      actor: '',
      actress: '',
      date_watched: '',
      released: '',
    };
    const {handleSubmit,setValue, control} = useForm({defaultValues:defaultValues})
    const submission = (data) => {
    const date_watched = Dayjs(data.date_watched["$d"]).format('YYYY-MM-DD')

    AxiosInstance.put(`api/movies/${MyId}/`,{
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
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(submission)}>

        <Box className={styles.title}>
          <Typography sx={{color: '#fff'}}>
            Edit Movie
          </Typography>
        </Box>
        <Box className={styles.textContainer}>
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
          <Box>
          <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>
            Submit
          </Button>
        </Box>
      </Box>
      </form>
    </div>
  )
}

export default Edit
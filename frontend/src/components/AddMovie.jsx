import { React } from 'react';
import { Box, Button, Typography } from '@mui/material';
import MyDatePickerField from './forms/MyDatePickerField';
import MyTextField from './forms/MyTextField';
import { useForm } from 'react-hook-form';
import AxiosInstance from './Axios';
import { useNavigate } from 'react-router-dom';
import {yupResolver} from '@hookform/resolvers/yup'
import styles from './styles/addmovie.module.css';
import * as yup from 'yup'

export const AddMovie = () => {
  
  const navigate = useNavigate();
  const defaultValues = {
    title: '',
    director: '',
    actor: '',
    actress: '',
    date_watched: '',
    released: '',
  };
  const schema = yup
  .object({
    title: yup.string().required('Title is required field'),
    director: yup.string().required('Director is required field'),
    actor: yup.string(),
    actress: yup.string(),
    date_watched: yup.date().required('Date Watched is required field'),
    released: yup.string().required('Released is required field'),
  })
  .required()

  const {handleSubmit,control} = useForm({defaultValues:defaultValues,resolver: yupResolver(schema)})

  const submission = (data) => {
    const date_watched = data.date_watched.toISOString().split('T')[0];
      AxiosInstance.post(`api/movies/`, {
        title: data.title,
        director: data.director,
        actor: data.actor,
        actress: data.actress,
        date_watched: date_watched,
        released: data.released,
      }).then((res) => {
        navigate(`/`);
      });
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(submission)}>

        <Box className={styles.title}>
          <Typography sx={{color:'#fff'}}>
            Enter Movie
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
            <Button variant="contained" type="submit" size='large' >
              Submit Movie
            </Button>
          </Box>
        </Box>

      </form> 
    </div>
  );
};

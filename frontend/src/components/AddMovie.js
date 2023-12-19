import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import MyDatePickerField from './forms/MyDatePickerField';
import MyTextField from './forms/MyTextField';
import { useForm } from 'react-hook-form';
import AxiosInstance from './Axios';
import Dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {yupResolver} from '@hookform/resolvers/yup'
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
    const date_watched = Dayjs(data.date_watched['$d']).format('YYYY-MM-DD');
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
    <div
      style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100vh',
      marginTop: '50px',
    }}
    >
      <form onSubmit={handleSubmit(submission)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '80%',
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
  );
};

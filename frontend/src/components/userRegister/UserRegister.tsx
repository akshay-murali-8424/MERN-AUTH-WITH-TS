import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { useUserRegisterMutation } from "../../redux/Features/api/apiSlice";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/Features/reducers/userAuthSlice";
import { useState } from "react";
import "./userRegister.css"
import { IRegisterPayload } from "../../types/UserInterface";

const schema = yup.object().shape({
  name: yup.string().required().min(6).matches(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]*$/,"enter a valid name"),
  email: yup.string().required().email(),
  password: yup.string().required(),
  confirmPassword: yup
    .string().required()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function UserRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterPayload>({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [registerError,setRegisterError] = useState('')

  const [registerUser]=useUserRegisterMutation(); 

  const submitHandler =async(data:IRegisterPayload) => {
    try{
      const res=await registerUser(data).unwrap()
      if(res.status==="success"){
        dispatch(setToken(res))
        navigate('/')
      }
    }catch(err:any){
      setRegisterError(err.data.message)
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitHandler)}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            fullWidth
            id="name"
            autoFocus
            label="Name"
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ""}
            {...register("name")}
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
            {...register("email")}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            id="password"
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            {...register("password")}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Confirm password"
            type="password"
            id="confirmPassword"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword ? errors.confirmPassword.message : ""}
            {...register("confirmPassword")}
          />
          <p className="errorrr">{registerError}</p>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container sx={{justifyContent:"center"}}>
            <Grid item >
              <Link to={"/login"}>
                <span style={{cursor:"pointer"}}>
                 Already have an account? Log in
                </span>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

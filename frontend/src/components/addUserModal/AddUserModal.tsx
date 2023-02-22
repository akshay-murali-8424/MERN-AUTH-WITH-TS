import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useUserRegisterMutation } from '../../redux/Features/api/apiSlice';
import { toast } from "react-toastify";
import { IRegisterPayload} from '../../types/UserInterface';

const schema = yup.object().shape({
  name: yup.string().required().min(6).matches(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]*$/,"enter a valid name"),
  email: yup.string().required().email(),
  password: yup.string().required(),
  confirmPassword: yup
    .string().required()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});


export default function AddUserModal() {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterPayload>({
    resolver: yupResolver(schema),
  });
  const [show, setShow] = useState(false);
  const [addError,setAddError]=useState('')
  const handleClose = () => {
   reset()
    setAddError('')
    setShow(false);
  }
  const handleShow = () => setShow(true);
  const [registerUser]=useUserRegisterMutation()

  const submitHandler=async(data:IRegisterPayload)=>{
    try{
      const res = await registerUser(data).unwrap()
      if(res.status==="success"){
         toast.success(`new user added: ${data.name}`)
         handleClose()
      }
    }catch(err:any){
     setAddError(err.data.message)
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{width:"10rem"}}>
        Add user
      </Button>

    <Modal show={show} onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submitHandler)}>
            <Form.Group className="mb-3" >
              <Form.Label>name</Form.Label>
              <Form.Control
                type="text"
                id='name'
                autoFocus
                
                {...register("name")}
              />
              <p style={{color:"red"}}>{errors.name?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                id="email"
               
                {...register("email")}
              />
              <p style={{color:"red"}}>{errors.email?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label>password</Form.Label>
              <Form.Control
                type="password"
                id='password'
             
                {...register("password")}
              />
              <p style={{color:"red"}}>{errors.password?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                id='confirmPpassword'
                {...register("confirmPassword")}
              />
              <p style={{color:"red"}}>{errors.confirmPassword?.message}</p>
            </Form.Group>
            <Modal.Footer>
              <p style={{color:"red", margin:"auto"}}>{addError}</p>
            <Button variant="primary" type='submit'>
            Add User
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
          </Form>

        </Modal.Body>
       
      </Modal> 
    </>
  );
}

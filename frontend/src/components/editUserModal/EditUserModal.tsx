import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useAdminEditUserMutation} from '../../redux/Features/api/apiSlice';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { ButtonBase } from '@mui/material';
import {ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IRegisterPayload } from '../../types/UserInterface';

const schema = yup.object().shape({
  name: yup.string().required().min(6).matches(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]*$/,"enter a valid name"),
  email: yup.string().required().email(),
});


export default function EditUserModal({name,email,id}:{name:string,email:string,id:string}) {
  <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterPayload>({
    resolver: yupResolver(schema),
  });
  const [show, setShow] = useState(false);
  const [addError,setAddError]=useState('')
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [updateUser] = useAdminEditUserMutation()

  const submitHandler=async(data:IRegisterPayload)=>{
    try{
      const res = await updateUser({data,id}).unwrap()
      if(res.status==="success"){
         handleClose()
      }
    }catch(err:any){
     setAddError(err.data.message)
    }
  }

  return (
    <>
      
      <ButtonBase onClick={handleShow}><EditTwoToneIcon/></ButtonBase>
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
                defaultValue={name}
                {...register("name")}
              />
              <p style={{color:"red"}}>{errors.name?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                id="email"
                defaultValue={email}
                {...register("email")}
              />
              <p style={{color:"red"}}>{errors.email?.message}</p>
            </Form.Group>
            <Modal.Footer>
              <p style={{color:"red", margin:"auto"}}>{addError}</p>
            <Button variant="primary" type='submit'>
            Update
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

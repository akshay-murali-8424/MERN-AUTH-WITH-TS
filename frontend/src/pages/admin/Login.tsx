import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import AdminLogin from '../../components/adminLogin/AdminLogin'
import { selectAdminAuth } from '../../redux/Features/reducers/adminAuthSlice'

function Login() {
  const data:{readonly token:string}=useSelector(selectAdminAuth)
  if(!data.token){
    return (
      <AdminLogin/>
    )
  }else{
    return(
      <Navigate to='/admin'/>
    )
  }
}

export default Login
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NavBar from "../../components/userHeader/userHeader";
import UserProfileCard from "../../components/userProfileCard/UserProfileCard";
import { useGetUserDataQuery } from "../../redux/Features/api/apiSlice";
import { selectUserAuth } from "../../redux/Features/reducers/userAuthSlice";
import { IUser } from "../../types/UserInterface";

function Home() {
  const user:{readonly token:string}=useSelector(selectUserAuth)
  let userData:IUser
  if(user.token){
    const { data, isSuccess } = useGetUserDataQuery()
    if(isSuccess){
       userData=data.userData
     
    return (
     <>
        <NavBar picture={userData.picture}/>
        <UserProfileCard name={userData.name} email={userData.email} picture={userData.picture} id={userData._id}/>
     </>
   
    );
    }else{
      return null
    }
  }else{
    return(
     <Navigate to='/login'/>
    )
  }
}

export default Home;

import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  useAdminDeleteUserMutation,
  useAdminGetUserDataQuery,
} from "../../redux/Features/api/apiSlice";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import Button from "@mui/material/Button";
import AddUserModal from "../addUserModal/AddUserModal";
import EditUserModal from "../editUserModal/EditUserModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IUser } from "../../types/UserInterface";


function AdminTable() {
  let users:IUser[] = [];
  const { data, isSuccess} =
    useAdminGetUserDataQuery();
  if (isSuccess) {
    users = data.users;
  }
  const [deleteUser] = useAdminDeleteUserMutation();

  const handleDelete = async (id:string,name:string) => {
    try {
      const res = await deleteUser(id).unwrap();
      if(res.status==="success"){
        toast.success(`${name} is deleted`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <AddUserModal />
      <Table striped bordered hover variant="dark">
        <thead style={{ fontSize: "35px" }}>
          <tr>
            <th>#</th>
            <th>name</th>
            <th>email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "23px" }}>
          {users.map((user, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td style={{ display: "flex" }}>
                  {" "}
                  <EditUserModal
                    key={index}
                    name={user.name}
                    email={user.email}
                    id={user._id}
                  />
                  <Button color="error" onClick={() => handleDelete(user._id,user.name)}>
                    <DeleteForeverTwoToneIcon />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default AdminTable;

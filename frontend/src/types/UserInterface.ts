
export interface ILoginPayload{
    email:string;
    password:string;
}

export interface IRegisterPayload extends ILoginPayload{
    name:string;
    confirmPassword:string;
}

export interface ILoginResponse{
    status:string;
    message:string;
    token:string;
    data?:{
        userId:string;
        name:string
    }
}

export interface IRegisterResponse{
    status:string;
    data:{
        userId:string;
        name:string
    }
    token:string;
}

export interface IUser{
    _id:string;
    name:string;
    email:string;
    password:string;
    createdAt:string;
    updatedAt:string;
    __v:number;
    picture?:string;
}
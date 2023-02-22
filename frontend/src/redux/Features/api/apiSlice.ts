import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../../urls';


export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, state) => {
            const { token: userToken } = state.getState().userAuth.data;
            const { token: adminToken } = state.getState().adminAuth.data;
            if (window.location.href.includes('admin')) {
                headers.set('authorization', `Bearer ${adminToken}`);
            } else {
                headers.set('authorization', `Bearer ${userToken}`);
            }
            return headers;
        }
    }),
    tagTypes: ['user', 'admin'],
    endpoints: (builder) => ({
        userLogin: builder.mutation({
            query: (loginData) => ({
                url: '/login',
                method: "POST",
                body: loginData
            }),
            invalidatesTags: ['user']
        }),
        userRegister: builder.mutation({
            query: (registerData) => ({
                url: '/register',
                method: "POST",
                body: registerData
            }),
            invalidatesTags: ['user']
        }),
        getUserData: builder.query({
            query: () => '/get-user',
            providesTags: ['user']
        }),
        setProfilePicture: builder.mutation({
            query: ({ formData, id }) => ({
                url: `/set-profile-picture/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ['user']
        }),
        adminLogin: builder.mutation({
            query: (loginData) => ({
                url: '/admin/login',
                method: "POST",
                body: loginData
            })
        }),
        adminGetUserData: builder.query({
            query: () => 'admin/get-users',
            providesTags: ['admin', 'user']
        }),

        adminAddNew: builder.mutation({
            query: (data) => ({
                url: '/admin/add-user',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['admin']
        }),

        adminEditUser: builder.mutation({
            query: ({ data, id }) => ({
                url: `/admin/edit-user/${id}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['admin', 'user']
        }),

        adminDeleteUser: builder.mutation({
            query: (id) => ({
                url: `/admin/delete-user/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['admin', 'user']
        }),
    })
})

export const {
    useUserLoginMutation,
    useUserRegisterMutation,
    useAdminLoginMutation,
    useAdminAddNewMutation,
    useAdminEditUserMutation,
    useAdminDeleteUserMutation,
    useGetUserDataQuery,
    useAdminGetUserDataQuery,
    useSetProfilePictureMutation
} = apiSlice;

import { apiSlice } from '@/redux/api/apiSlice';

export const staffApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => ({
                url: '/staffs/me',
                method: 'GET',
            }),
            providesTags: ['staff'],
        }),
        createStaff: builder.mutation({
            query: (body) => ({
                url: '/staffs/create',
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ['staff'],
        }),
        completeProfile: builder.mutation({
            query: (body) => ({
                url: '/staffs/complete-profile',
                method: 'PUT',
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ['staff'],
        }),
        updateProfile: builder.mutation({
            query: (body) => ({
                url: '/staffs/update-profile',
                method: 'PUT',
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ['staff'],
        }),
    }),
});

export const {
    useGetMeQuery,
    useCreateStaffMutation,
    useCompleteProfileMutation,
    useUpdateProfileMutation,
} = staffApi;

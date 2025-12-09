import { apiSlice } from '@/redux/api/apiSlice';

export const attendanceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        checkIn: builder.mutation({
            query: (body) => ({
                url: '/attendance/check-in',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Attendance'],
        }),
    }),
});

export const { useCheckInMutation } = attendanceApi;

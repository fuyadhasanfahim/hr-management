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
        checkOut: builder.mutation({
            query: (body) => ({
                url: '/attendance/check-out',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Attendance'],
        }),
        getTodayAttendance: builder.query({
            query: () => ({
                url: '/attendance/today',
                method: 'GET',
            }),
            providesTags: ['Attendance'],
        }),
    }),
});

export const { useCheckInMutation,useCheckOutMutation,  useGetTodayAttendanceQuery } = attendanceApi;

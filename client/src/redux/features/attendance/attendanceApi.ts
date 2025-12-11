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
        getMonthlyStats: builder.query({
            query: () => ({
                url: '/attendance/monthly-stats',
                method: 'GET',
            }),
            // Use transformResponse if data structure is { success: true, data: ... }
            transformResponse: (response: { data: any }) => response.data,
            providesTags: ['Attendance', 'Overtime'], // Invalidate when Attendance OR Overtime changes
        }),
    }),
});

export const {
    useCheckInMutation,
    useCheckOutMutation,
    useGetTodayAttendanceQuery,
    useGetMonthlyStatsQuery,
} = attendanceApi;

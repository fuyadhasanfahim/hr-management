import { apiSlice } from '@/redux/api/apiSlice';

export const shiftApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createShift: builder.mutation({
            query: (data) => ({
                url: '/shifts',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Shift'],
        }),

        getAllShifts: builder.query({
            query: () => ({
                url: '/shifts',
                method: 'GET',
            }),
            providesTags: ['Shift'],
        }),

        getMyShift: builder.query({
            query: () => ({
                url: '/shifts/my-shift',
                method: 'GET',
            }),
            providesTags: ['Shift'],
        }),

        updateShift: builder.mutation({
            query: ({ id, data }) => ({
                url: `/shifts/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Shift'],
        }),

        deleteShift: builder.mutation({
            query: (id) => ({
                url: `/shifts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Shift'],
        }),
    }),
});

export const {
    useGetMyShiftQuery,
    useCreateShiftMutation,
    useGetAllShiftsQuery,
    useUpdateShiftMutation,
    useDeleteShiftMutation,
} = shiftApi;

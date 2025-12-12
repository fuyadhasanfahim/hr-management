import { apiSlice } from '@/redux/api/apiSlice';

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: (params) => ({
                url: '/notifications',
                method: 'GET',
                params,
            }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: ['Notification'],
        }),
        getUnreadCount: builder.query({
            query: () => ({
                url: '/notifications/unread-count',
                method: 'GET',
            }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: ['Notification'],
        }),
        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Notification'],
        }),
        markAllAsRead: builder.mutation({
            query: () => ({
                url: '/notifications/read-all',
                method: 'POST',
            }),
            invalidatesTags: ['Notification'],
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notification'],
        }),
        deleteAllNotifications: builder.mutation({
            query: () => ({
                url: '/notifications',
                method: 'DELETE',
            }),
            invalidatesTags: ['Notification'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useGetUnreadCountQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
    useDeleteAllNotificationsMutation,
} = notificationApi;

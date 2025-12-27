import { apiSlice } from '../../api/apiSlice';
import type {
    IService,
    CreateServiceInput,
    UpdateServiceInput,
} from '@/types/order.type';

interface ServicesResponse {
    message: string;
    data: IService[];
    meta: {
        total: number;
    };
}

interface ServiceResponse {
    message: string;
    data: IService;
}

interface GetServicesParams {
    isActive?: boolean;
    page?: number;
    limit?: number;
}

export const serviceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query<ServicesResponse, GetServicesParams | void>({
            query: (params) => ({
                url: '/services',
                params: params || {},
            }),
            providesTags: ['Service'],
        }),

        getServiceById: builder.query<ServiceResponse, string>({
            query: (id) => `/services/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Service', id }],
        }),

        createService: builder.mutation<ServiceResponse, CreateServiceInput>({
            query: (data) => ({
                url: '/services',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Service'],
        }),

        updateService: builder.mutation<
            ServiceResponse,
            { id: string; data: UpdateServiceInput }
        >({
            query: ({ id, data }) => ({
                url: `/services/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Service', id },
                'Service',
            ],
        }),

        deleteService: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/services/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Service'],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useGetServiceByIdQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = serviceApi;

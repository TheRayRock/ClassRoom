import { CreateDataProviderOptions, createDataProvider } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constant";
import { ListResponse } from "@/types";

if (!BACKEND_BASE_URL) {
    throw new Error("BACKEND_BASE_URL is not defined in the environment variables.");
}

const options: CreateDataProviderOptions = {
    getList: {
        getEndpoint: ({resource}) => resource,

        buildQueryParams: async ({resource, filters, pagination}) => {
            const page = pagination?.currentPage ?? 1;
            const pageSize = pagination?.pageSize ?? 10;

            const params: Record<string, string | number> = { page, limit:pageSize };
            filters?.forEach((filter) => { 
                const field = 'field' in filter ? filter.field : '';
                const value = String(filter.value);
                if(resource ===  'subjects'){
                    if(field ===   'department')params.department = value;
                    if(field ===   'name' || field === 'code') params.search = value;
                }

        
            })

            return params;

        },

        mapResponse: async (response) => {
            const payload: ListResponse =  await response.clone().json();
            return payload.data ?? [];
        },

        getTotalCount: async (response) => {
            const payload: ListResponse =  await response.clone().json();
            return payload.Pagination?.total ?? payload.data.length ?? 0;
        }

}
}

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };

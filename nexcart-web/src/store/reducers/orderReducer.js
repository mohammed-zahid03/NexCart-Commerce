const initialState = {
    adminOrder: null,
    adminReturns: null,
    pagination: {},
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_ADMIN_ORDERS":
            return {
                ...state,
                adminOrder: action.payload,
                pagination: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };

        case "GET_ADMIN_RETURNS":
            return {
                ...state,
                adminReturns: action.payload,
            };

        default:
            return state;
    }
};
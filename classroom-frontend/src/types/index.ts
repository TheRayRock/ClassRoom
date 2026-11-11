export type Subject = {
  id: number;
  name: string;
  code: string;
  department: string;
  desciption: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
};

export type ListResponse<T = unknown> = {
  data: T[];
  Pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};



export type CreateResponse<T = unknown> = {
  data: T;
};


export type GetOneResponse<T = unknown> = {
  data: T;
};

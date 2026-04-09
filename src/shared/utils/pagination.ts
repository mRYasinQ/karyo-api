import type { BaseQuerySchema } from '../schemas/base-query.schema';

interface PaginationOptions {
  query: BaseQuerySchema;
  isOptional?: boolean;
  defaultSort?: string | string[];
}

interface Pagination {
  page: number;
  pages: number;
  total: number;
  limit: number | undefined;
  nextPage: number | null;
  prevPage: number | null;
}

const getPaginationOptions = (options: PaginationOptions) => {
  const { query, isOptional = false, defaultSort = 'createdAt' } = options;
  const { page = 1, limit = 25, sort_by, order = 'DESC' } = query;

  const shouldPaginate = !(isOptional && !query.limit);
  const finalLimit = shouldPaginate ? limit : undefined;
  const offset = shouldPaginate ? (page - 1) * limit : undefined;

  const sortableFields = sort_by?.length ? sort_by : Array.isArray(defaultSort) ? defaultSort : [defaultSort];
  const orderBy = sortableFields.reduce((acc, field) => ({ ...acc, [field]: order }), {});

  return {
    page,
    limit: finalLimit,
    offset,
    orderBy,
    hasPagination: shouldPaginate,
  };
};

const paginate = <T>(data: T[], total: number, page: number, limit: number | undefined): [T[], Pagination] => {
  const pages = limit ? Math.ceil(total / limit) : 1;
  const nextPage = page < pages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  const meta: Pagination = {
    page,
    pages,
    total,
    limit,
    nextPage,
    prevPage,
  };

  return [data, meta];
};

export type { PaginationOptions, Pagination };
export { getPaginationOptions, paginate };

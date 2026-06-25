import type { H3Event } from 'h3'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function getPagination(event: H3Event): { page: number; limit: number; offset: number } {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20))
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

export function wrapPaginated<T>(data: T[], meta: PaginationMeta) {
  return { data, meta }
}

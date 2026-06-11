type QueryOptionSource = {
  queryKey: unknown
  queryFn?: unknown
}

export type QueryOptions<TOptions extends QueryOptionSource> = Omit<TOptions, 'queryKey' | 'queryFn'>

export type UseInfiteQueryOptions<TOptions extends QueryOptionSource> = Omit<
  TOptions,
  'queryKey' | 'queryFn' | 'getNextPageParam' | 'getPreviousPageParam' | 'initialPageParam'
>

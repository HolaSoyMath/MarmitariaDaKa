import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useWeeksCount() {
  return useQuery({
    queryKey: ['weeks-count'],
    queryFn: async () => {
      const { data } = await api.get<{ id: string; number: number; year: number }[]>('/weeks')
      return data.length
    },
  })
}

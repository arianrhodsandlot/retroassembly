import { useLoaderData } from 'react-router'
import type { getLoaderData } from '@/utils/server/loader-data'

export const useGlobalLoaderData = useLoaderData<typeof getLoaderData>

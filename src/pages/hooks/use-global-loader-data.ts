import { useLoaderData } from 'react-router'
import type { getCommonLoaderData } from '#@/utils/server/loader-data.ts'

export const useGlobalLoaderData = useLoaderData<typeof getCommonLoaderData>

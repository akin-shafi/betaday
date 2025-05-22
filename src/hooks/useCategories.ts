/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';

export interface SubCategory {
  name: string;
  image: string;
}

export interface MainCategory {
  name: string;
  image: string;
  subcategories: SubCategory[];
}

export const useCategories = () => {
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8500';

  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<MainCategory[]> => {
      const response = await fetch(`${API_URL}/api/groups?isActive=true`, {
        headers: {
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
      }

      const data = await response.json();
      const categories: MainCategory[] = Array.isArray(data.groups)
        ? data.groups.map((group: any) => ({
            name: group.name,
            image: group.image,
            subcategories: Array.isArray(group.subGroups)
              ? group.subGroups.map((subGroup: any) => ({
                  name: subGroup.name,
                  image: subGroup.image,
                }))
              : [],
          }))
        : [];

      return categories;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
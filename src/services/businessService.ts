import { getAuthToken } from '@/utils/auth';

export const saveToFavorite = async (businessId: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/businesses/save-to-favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ businessId }),
  });

  

  if (!response.ok) {
    throw new Error('Failed to save to favorites');
  }
}; 


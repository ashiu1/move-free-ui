import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { getExerciseData, postFitnessVideo } from './ExerciseApi.ts'

export const useExerciseData = (url: string) => {
  return useQuery({
    queryKey: ['getExerciseData', url],
    queryFn: () => getExerciseData(url),
    enabled: !!url, // Only run query if url is provided
  });
};

export const usePostFitnessVideo = (url: string) => {
  return useQuery({
    queryKey: ['postFitnessVideo', url],
    queryFn: () => postFitnessVideo(url),
    enabled: !!url, // Only run query if url is provided
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin } from '../../services/apiCabins';
import { toast } from 'react-hot-toast';

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }) => {
      console.log('useEditCabin newCabinData', newCabinData);
      createEditCabin(newCabinData, id);
    },
    onSuccess: () => {
      toast.success('Cabin successfully edited');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { isEditing, editCabin };
}

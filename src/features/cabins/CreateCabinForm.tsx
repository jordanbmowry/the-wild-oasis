import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import FormRow from '../../ui/FormRow';
import Textarea from '../../ui/Textarea';
import { useForm } from 'react-hook-form';

import { createCabin, type NewCabin } from '../../services/apiCabins';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface CustomError {
  message: string;
}

function CreateCabinForm() {
  const { register, handleSubmit, reset, getValues, formState } =
    useForm<NewCabin>();
  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      reset();
    },
    onError: (err: CustomError) => toast.error(err.message),
  });

  const onSubmit = (data: NewCabin) => {
    //@ts-ignore
    mutate({ ...data, image: data.image[0] });
  };

  const onError = (errors: { [key: string]: any }) => {
    console.log(errors);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow error={errors?.name?.message} label='Cabin name'>
        <Input
          disabled={isCreating}
          type='text'
          id='name'
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow error={errors?.maxCapacity?.message} label='Maximum capacity'>
        <Input
          disabled={isCreating}
          type='number'
          id='maxCapacity'
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least one',
            },
          })}
        />
      </FormRow>

      <FormRow error={errors?.regularPrice?.message} label='Regular price'>
        <Input
          disabled={isCreating}
          type='number'
          id='regularPrice'
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Price should be at least one',
            },
          })}
        />
      </FormRow>

      <FormRow error={errors?.discount?.message} label='Discount'>
        <Input
          disabled={isCreating}
          type='number'
          id='discount'
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: {
              isLessThanRegularPrice: (value) => {
                const regularPrice = getValues('regularPrice');
                if (Number(value) >= Number(regularPrice)) {
                  return 'Discount should be less than regular price';
                }
                return true;
              },
            },
          })}
        />
      </FormRow>

      <FormRow
        error={errors?.description?.message}
        label='Description for website'
      >
        <Textarea
          disabled={isCreating}
          id='description'
          defaultValue=''
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Cabin photo'>
        <FileInput
          disabled={isCreating}
          id='image'
          type='file'
          accept='image/*'
          {...register('image', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        <>
          <Button variation='secondary' type='reset'>
            Cancel
          </Button>
          <Button disabled={isCreating}>Add cabin</Button>
        </>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;

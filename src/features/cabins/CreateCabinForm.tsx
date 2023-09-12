import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import FormRow from '../../ui/FormRow';
import Textarea from '../../ui/Textarea';
import { useForm } from 'react-hook-form';

import { createEditCabin, type NewCabin } from '../../services/apiCabins';

import { useCreateCabin } from './useCreateCabin';
import { useEditCabin } from './useEditCabin';

interface CustomError {
  message: string;
}

interface CreateCabinFormProps {
  cabinToEdit?: {
    id: number;
    description: string;
    discount: number;
    created_at: Date;
    image: string;
    max_capacity: number;
    name: string;
    regular_price: number;
  };
}

function CreateCabinForm({ cabinToEdit = {} }) {
  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = cabinToEdit;
  console.log('cabinToEdit in CreateCabinForm', cabinToEdit);

  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<NewCabin>({
      defaultValues: isEditSession ? { ...editValues } : {},
    });
  const { errors } = formState;

  function onSubmit(data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0];

    if (isEditSession) {
      editCabin(
        {
          newCabinData: {
            ...data,
            image,
          },
          id: editId,
        },
        {
          onSuccess: (data) => {
            reset();
          },
        }
      );
    } else {
      createCabin(
        {
          ...data,
          image,
        },
        {
          onSuccess: (data) => {
            reset();
          },
        }
      );
    }
  }

  const onError = (errors: { [key: string]: any }) => {
    console.log(errors);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow error={errors?.name?.message} label='Cabin name'>
        <Input
          disabled={isWorking}
          type='text'
          id='name'
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow error={errors?.max_capacity?.message} label='Maximum capacity'>
        <Input
          disabled={isWorking}
          type='number'
          id='maxCapacity'
          {...register('max_capacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least one',
            },
          })}
        />
      </FormRow>

      <FormRow error={errors?.regular_price?.message} label='Regular price'>
        <Input
          disabled={isWorking}
          type='number'
          id='regular_price'
          {...register('regular_price', {
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
          disabled={isWorking}
          type='number'
          id='discount'
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: {
              isLessThanRegularPrice: (value) => {
                const regularPrice = getValues('regular_price');
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
          disabled={isWorking}
          id='description'
          defaultValue=''
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Cabin photo'>
        <FileInput
          disabled={isWorking}
          id='image'
          type='file'
          accept='image/*'
          {...register('image', {
            required: isEditSession ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        <>
          <Button variation='secondary' type='reset'>
            Cancel
          </Button>
          <Button disabled={isWorking}>
            {isEditSession ? 'Edit cabin' : 'Create new cabin'}
          </Button>
        </>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;

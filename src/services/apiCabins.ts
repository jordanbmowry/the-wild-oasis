import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data;
}

export async function deleteCabin(id: number) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    throw new Error('Cabin could not be deleted');
  }
  return data;
}
export interface NewCabin {
  description: string;
  discount: string;
  maxCapacity: string;
  name: string;
  regularPrice: string;
  image: File | Blob;
}

export async function createCabin(newCabin: NewCabin) {
  const imageName = `${Math.random()}-${newCabin.image?.name}`.replaceAll(
    '/',
    ''
  );
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  const { maxCapacity, regularPrice, discount, ...rest } = newCabin;

  const parsedMaxCapacity = parseInt(maxCapacity, 10);
  const parsedRegularPrice = parseFloat(regularPrice);
  const parsedDiscount = parseFloat(discount);

  const { data, error } = await supabase
    .from('cabins')
    .insert([
      {
        ...rest,
        max_capacity: parsedMaxCapacity,
        regular_price: parsedRegularPrice,
        discount: parsedDiscount,
        image: imagePath,
      },
    ])
    .select();

  if (error) {
    throw new Error('Cabin could not be created');
  }

  console.log(imageName, newCabin.image);

  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  if (storageError) {
    const { id } = data[0];
    await supabase.from('cabins').delete().eq('id', id);
    console.error(storageError);
    throw new Error(
      'Cabin image could not be uploaded and the cabin was not created'
    );
  }

  return data;
}

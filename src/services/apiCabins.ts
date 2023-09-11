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
  max_capacity: string;
  name: string;
  regular_price: string;
  image: FileList;
}

export async function createEditCabin(newCabin: NewCabin, id: number) {
  console.log('newCabin', newCabin);
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );

  let query = supabase.from('cabins');

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { max_capacity, regular_price, discount, ...rest } = newCabin;

  console.log(newCabin);

  const parsedMaxCapacity = parseInt(max_capacity, 10);
  const parsedRegularPrice = parseFloat(regular_price);
  const parsedDiscount = parseFloat(discount);

  if (!id) {
    console.log('!id if block');
    console.log({
      ...rest,
      max_capacity: parsedMaxCapacity,
      regular_price: parsedRegularPrice,
      discount: parsedDiscount,
      image: imagePath,
    });
    query = query.insert([
      {
        ...rest,
        max_capacity: parsedMaxCapacity,
        regular_price: parsedRegularPrice,
        discount: parsedDiscount,
        image: imagePath,
      },
    ]);
  }

  if (id) {
    console.log('id if block');
    console.log({
      ...rest,
      max_capacity: parsedMaxCapacity,
      regular_price: parsedRegularPrice,
      discount: parsedDiscount,
      image: imagePath,
    });
    query = query
      .update({
        ...rest,
        max_capacity: parsedMaxCapacity,
        regular_price: parsedRegularPrice,
        discount: parsedDiscount,
        image: imagePath,
      })
      .eq('id', id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created');
  }

  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    console.error(storageError);
    throw new Error(
      'Cabin image could not be uploaded and the cabin was not created'
    );
  }

  return data;
}

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
  discount: number;
  max_capacity: number;
  name: string;
  regular_price: number;
  image: FileList | string;
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

  if (!id) {
    query = query.insert([
      {
        ...newCabin,
        image: imagePath,
      },
    ]);
  }

  if (id) {
    query = query
      .update({
        ...newCabin,
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

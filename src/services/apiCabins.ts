import supabase from './supabase';

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
}

export async function createCabin(newCabin: NewCabin) {
  const { maxCapacity, regularPrice, ...rest } = newCabin;
  const { data, error } = await supabase
    .from('cabins')
    .insert([
      { max_capacity: maxCapacity, regular_price: regularPrice, ...rest },
    ])
    .select();

  if (error) {
    throw new Error('Cabin could not be created');
  }
  return data;
}

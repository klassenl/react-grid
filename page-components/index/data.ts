export type Breed =
  | 'russian-blue'
  | 'siamese'
  | 'abyssinian'
  | 'bengal'
  | 'unknown'

export type Cat = {
  name: string
  price: number
  age: number
  breed: Breed
  fav_food: string
}

const CATS: Cat[] = [
  {
    name: 'Sergei',
    price: 800,
    age: 10,
    breed: 'russian-blue',
    fav_food: 'chicken',
  },
  {
    name: 'Vladimir',
    price: 600,
    age: 3,
    breed: 'russian-blue',
    fav_food: 'pizza',
  },
  {
    name: 'Fluffy',
    price: 200,
    age: 1,
    breed: 'unknown',
    fav_food: 'fancy feast',
  },
  {
    name: 'Ralph',
    price: 400,
    age: 1,
    breed: 'abyssinian',
    fav_food: 'red bull',
  },
]

export default CATS

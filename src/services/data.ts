import products from '../data/products.json'
import categories from '../data/categories.json'
import users from '../data/users.json'
import settings from '../data/settings.json'

export type Product = (typeof products[number]) & { video?: string }
export type Category = typeof categories[number]
export type User = typeof users[number]
export type Settings = typeof settings

export const getAllProducts = async (): Promise<Product[]> => {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 120))
  // filter products without images to avoid placeholder cards
  return products.filter((p) => Array.isArray((p as Product).images) && (p as Product).images.length > 0) as Product[]
}

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  await new Promise((r) => setTimeout(r, 80))
  const product = (products.find((p) => p.slug === slug) as Product | undefined)
  // only return product if it has images
  if (product && Array.isArray(product.images) && product.images.length > 0) return product
  return undefined
}

export const getCategories = async (): Promise<Category[]> => {
  await new Promise((r) => setTimeout(r, 60))
  return categories
}

export const getSettings = async (): Promise<Settings> => {
  await new Promise((r) => setTimeout(r, 30))
  return settings
}

export const getUser = async (id: string): Promise<User | undefined> => {
  await new Promise((r) => setTimeout(r, 50))
  return users.find((u) => u.id === id)
}

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id)
}

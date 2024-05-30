import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatPrice = (price: number | string) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ILS',
  })

  return formatter.format(+price)
}


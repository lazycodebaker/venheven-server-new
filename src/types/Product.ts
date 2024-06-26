
import { z } from "zod";

export const productSchema = z.object({
      product_id: z.string(),
      name: z.string(),
      category: z.string(),
      description: z.string(),
      price: z.number(),
      images: z.array(z.string()),
      videos: z.array(z.string()),
      ratings: z.object({
            average: z.number(),
            count: z.number(),
      }),
      reviews: z.array(
            z.object({
                  user_id: z.string(),
                  text: z.string(),
                  rating: z.number(),
                  date: z.string(),
            })
      ),
      attributes: z.object({
            sizes: z.array(z.string()),
            colors: z.array(z.string()),
            materials: z.array(z.string()),
      }),
      tags: z.array(z.string()),
      createdAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
});

export type ProductType = z.infer<typeof productSchema>;
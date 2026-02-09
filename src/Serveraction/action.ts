"use server";

import { z } from "zod";

// Define the schema here so both files can use it
export const searchSchema = z.object({
  query: z.string().optional(),
  subject: z.string().default("Subject"),
  rating: z.number().min(0).max(5).default(0),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export async function handleSearchAction(values: z.infer<typeof searchSchema>) {
  // Logic for your database query goes here
  console.log("Server received:", values);
  
  return { 
    success: true, 
    data: values 
  };
}
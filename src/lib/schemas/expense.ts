import { z } from "zod";
import { PaymentMethod, ExpenseCategory } from "@prisma/client";

export const ExpenseSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  category: z.nativeEnum(ExpenseCategory),
  paymentMethod: z.nativeEnum(PaymentMethod),
  vendor: z.string().optional(),
  notes: z.string().optional(),
  paidAt: z.date().optional().default(() => new Date()),
});

export type ExpenseFormValues = z.infer<typeof ExpenseSchema>;

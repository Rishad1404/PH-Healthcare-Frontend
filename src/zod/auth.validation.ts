import z, { email } from 'zod'


export const loginZodSchema = z.object({
    email:z.email("Invalid email address"),
    password:z.string().min(1,"Password is required").regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, "Password must contain at least one letter, one number, and one special character")
})

export type ILoginPayload=z.infer<typeof loginZodSchema>
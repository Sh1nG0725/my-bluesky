'use server';
 
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { agent } from '@/app/lib/api';

const FormSchema = z.object({
  id: z.string(),
  content: z.string()
  .max(200, { message: "200文字以内で入力してください" })
  .refine((value) => {
    return Boolean(value.trim().length)
  }, 'なにか言いたいことはあった？'),
});

export type State = {
  errors?: {
    content?: string[];
  };
  message?: string | null;
};

const CreatePost = FormSchema.omit({ id: true });
export async function createPost(prevState: State, formData: FormData) {
  const validatedFields = CreatePost.safeParse({
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Post.',
    };
  }

  const { content } = validatedFields.data;
  
  try {
    const session = await auth();
    await agent.login({ identifier: session?.user?.email || "", password: session?.user?.app_password || "" });
    
    await agent.post({
      text: content,
    });
  } catch (error) {
    return {
      message: 'Failed to Post.',
    };
  }
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Invalid credentials'
    }
    throw error;
  }
}
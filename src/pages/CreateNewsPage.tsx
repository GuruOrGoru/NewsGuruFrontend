
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createNews, NewsItem } from '@/services/newsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Schema for news form validation
const newsFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100, { message: 'Title must not exceed 100 characters' }),
  body: z.string().min(20, { message: 'Content must be at least 20 characters' }),
  author_name: z.string().min(2, { message: 'Author name must be at least 2 characters' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters' }),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

const CreateNewsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: '',
      body: '',
      author_name: '',
      category: '',
    },
  });

  const onSubmit = async (values: NewsFormValues) => {
    try {
      // Add current timestamp to form values
      const newsToCreate: Omit<NewsItem, 'news_id'> = {
        title: values.title,
        body: values.body,
        author_name: values.author_name,
        category: values.category,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await createNews(newsToCreate);
      
      if (response) {
        toast.success('News article created successfully!');
        navigate('/');
      } else {
        toast.error('Failed to create news article');
      }
    } catch (error) {
      toast.error('An error occurred while creating the news article');
      console.error('Error creating news:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create News Article</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the form below to create a new news article.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter news title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Tech, World, Sports" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Write your news article content here..." 
                    className="min-h-[200px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button 
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Creating...' : 'Create Article'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateNewsPage;


import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getNewsById, deleteNews } from '@/services/newsService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Loader2, Calendar, Clock, User, ArrowLeft, Trash } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const newsId = parseInt(id || '0');
  
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', newsId],
    queryFn: () => getNewsById(newsId),
    enabled: !!newsId && !isNaN(newsId),
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load the news article.');
    }
  }, [error]);

  const handleDelete = async () => {
    try {
      const success = await deleteNews(newsId);
      if (success) {
        toast.success('News article deleted successfully');
        navigate('/');
      } else {
        toast.error('Failed to delete the news article');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the news article');
    }
  };

  // Helper function to safely parse dates
  const parseDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isValid(date) ? date : null;
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">News article not found</h2>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  const publishedDate = parseDate(news.published_at);
  const updatedDate = parseDate(news.updated_at);

  return (
    <article className="max-w-3xl mx-auto">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      
      <header className="mb-8">
        <Badge variant="outline" className="mb-4">{news.category}</Badge>
        <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{news.author_name}</span>
          </div>
          {publishedDate && (
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{format(publishedDate, 'MMM d, yyyy')}</span>
            </div>
          )}
          {updatedDate && publishedDate && updatedDate.getTime() !== publishedDate.getTime() && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Updated: {format(updatedDate, 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        {news.body.split('\n').map((paragraph, index) => (
          paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
        ))}
      </div>
      
      <div className="mt-12 border-t pt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Article
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this article? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </article>
  );
};

export default NewsDetailPage;

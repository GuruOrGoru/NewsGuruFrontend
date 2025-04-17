
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsItem } from '@/services/newsService';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const publishedDate = new Date(news.published_at);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
  
  // Truncate body text for preview
  const previewText = news.body.length > 150 
    ? `${news.body.substring(0, 150)}...` 
    : news.body;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="mb-2">{news.category}</Badge>
        </div>
        <CardTitle className="text-xl">
          <Link to={`/news/${news.news_id}`} className="hover:underline">
            {news.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{previewText}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t">
        <div className="flex items-center gap-1">
          <User size={14} />
          <span>{news.author_name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{timeAgo}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;


import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllNews, NewsItem } from '@/services/newsService';
import NewsCard from '@/components/NewsCard';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: getAllNews,
  });
  
  // Extract unique categories
  const categories = news 
    ? Array.from(new Set(news.map(item => item.category)))
    : [];

  // Filter news by category if one is selected
  const filteredNews = activeCategory 
    ? news?.filter(item => item.category === activeCategory) 
    : news;

  useEffect(() => {
    if (error) {
      toast.error('Failed to load news. Please try again later.');
    }
  }, [error]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Latest News</h1>
        
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${activeCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'}`}
              >
                {category}
              </button>
            ))}
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="px-3 py-1 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
              >
                Show All
              </button>
            )}
          </div>
        )}
      </div>

      {filteredNews && filteredNews.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <NewsCard key={item.news_id} news={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No news articles found.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;

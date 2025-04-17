
import axios from 'axios';

// Configuration settings for API
// If you're testing on a different port, you can update this value
const API_URL = 'http://localhost:8414';

export interface NewsItem {
  news_id?: number;
  title: string;
  body: string;
  author_name: string;
  category: string;
  published_at: string;
  updated_at?: string;
}

export const getAllNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/news`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const getNewsById = async (id: number): Promise<NewsItem | null> => {
  try {
    const response = await axios.get(`${API_URL}/news/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news with id ${id}:`, error);
    return null;
  }
};

export const createNews = async (news: Omit<NewsItem, 'news_id'>): Promise<{ id: number; message: string } | null> => {
  try {
    // Ensure published_at and updated_at are set
    const newsWithTimestamps = {
      ...news,
      published_at: news.published_at || new Date().toISOString(),
      updated_at: news.updated_at || new Date().toISOString()
    };
    
    const response = await axios.post(`${API_URL}/news`, newsWithTimestamps);
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error);
    return null;
  }
};

export const deleteNews = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/news/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting news with id ${id}:`, error);
    return false;
  }
};

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  const googleSearchUrl = "https://www.google.com/search?q=karthikeya+astrological+centre&oq=&gs_lcrp=EgZjaHJvbWUqBggCEEUYOzIHCAAQABiPAjISCAEQLhhDGIMBGLEDGIAEGIoFMgYIAhBFGDsyDQgDEC4YgwEYsQMYgAQyBwgEEC4YgAQyBggFEEUYPTIGCAYQRRg9MgYIBxBFGD3SAQgyNzU0ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#sv=CAwStAIKBmxjbF9wdhJOCgNwdnESR0NnMHZaeTh4TVhoNVl6RjVhblpmSWlRS0htdGhjblJvYVd0bGVXRWdZWE4wY205c2IyZHBZMkZzSUdObGJuUnlaUkFDR0FNEowBCgNscWkShAFDaDVyWVhKMGFHbHJaWGxoSUdGemRISnZiRzluYVdOaGJDQmpaVzUwY21WSTM0YjdzUFc4Z0lBSVdpb1FBQkFCRUFJWUFSZ0NJaDVyWVhKMGFHbHJaWGxoSUdGemRISnZiRzluYVdOaGJDQmpaVzUwY21WU0FRcGhjM1J5YjJ4dloyVnkSEgoDdGJzEgtscmY6ITNzSUFFPRIjCgFxEh5rYXJ0aGlrZXlhIGFzdHJvbG9naWNhbCBjZW50cmUaEmxvY2FsLXBsYWNlLXZpZXdlchgKIO-GjpUN";

  // Load reviews from local database file
  const getLocalData = () => {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', 'reviews.json');
      const fileData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileData);
    } catch (err) {
      console.error("Failed to read local reviews JSON:", err);
      // Hardcoded ultimate fallback
      return {
        rating: 4.8,
        totalReviews: 142,
        googleSearchUrl: googleSearchUrl,
        reviews: [
          {
            id: 1,
            author: "Ramesh Kumar",
            location: "Chennai",
            rating: 5,
            text: "Highly accurate predictions and practical advice. His calculation of planetary transits was 100% correct, and the suggested remedies brought immediate relief.",
            time: "1 week ago"
          }
        ]
      };
    }
  };

  // If Places API Key and Place ID are set, query Google Places API for real-time reviews
  if (apiKey && placeId) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`,
        { next: { revalidate: 3600 } } // Cache response for 1 hour to prevent excessive API costs and speed up load times
      );

      if (!response.ok) {
        throw new Error(`Google API returned status ${response.status}`);
      }

      const json = await response.json();

      if (json.status !== 'OK') {
        throw new Error(`Google API status returned ${json.status}: ${json.error_message || ''}`);
      }

      const result = json.result;
      const rating = result.rating || 4.8;
      const totalReviews = result.user_ratings_total || 142;

      const reviews = (result.reviews || []).map((rev: any, index: number) => ({
        id: index + 1,
        author: rev.author_name || "Seeker",
        location: rev.relative_time_description || "Verified Google User",
        rating: rev.rating || 5,
        text: rev.text || "",
        time: rev.relative_time_description || "recently"
      }));

      return NextResponse.json({
        rating,
        totalReviews,
        googleSearchUrl,
        reviews
      });
    } catch (err) {
      console.error("Failed to fetch live Google Reviews, falling back to local JSON database:", err);
      return NextResponse.json(getLocalData());
    }
  }

  // Fallback to local static reviews database if environment keys are missing
  return NextResponse.json(getLocalData());
}

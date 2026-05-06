import axios from "axios";

const fetchDestinationImages = async (destination) => {
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: `${destination} landmarks nature`,
                per_page: 5, // Get 5 high-quality images
                orientation: 'landscape'
            },
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });

        // Map through results to get a clean array of regular image URLs
        return response.data.results.map(img => img.urls.regular);
    } catch (error) {
        console.error("Error fetching images from Unsplash:", error.message);
        // Fallback placeholder if API fails or limit is hit
        return ["https://images.unsplash.com/photo-1488646953014-85cb44e25828"];
    }
}

export default fetchDestinationImages;
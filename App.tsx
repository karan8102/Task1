import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { PRODUCTS } from './data/products';
import { getRecommendations } from './services/ai';
import { Sparkles } from 'lucide-react';

function App() {
    const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (query: string) => {
        setIsSearching(true);
        setHasSearched(true);
        setError(null);
        setRecommendedIds([]); // Reset previous
        try {
            const ids = await getRecommendations(query, PRODUCTS);
            setRecommendedIds(ids);
        } catch (err) {
            console.error("Failed to get recommendations", err);
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSearching(false);
        }
    };

    const recommendedProducts = PRODUCTS.filter(p => recommendedIds.includes(p.id));

    // If we have recommendations, show others below. If not, showing all is fine, but maybe sort them?
    // Let's just exclude recommended ones from the bottom list to avoid duplicates.
    const otherProducts = PRODUCTS.filter(p => !recommendedIds.includes(p.id));

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50/70 backdrop-blur-md bg-white/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            SmartShop AI
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
                        Find Your Perfect Product
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Describe what you need, and our AI will analyze our catalog to find the best matches for you.
                    </p>
                    <SearchBar onSearch={handleSearch} isLoading={isSearching} />
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 max-w-2xl mx-auto">
                            <p className="font-semibold">AI Error:</p>
                            <p>{error}</p>
                            <p className="text-sm mt-1 text-red-600">Check the console for more details.</p>
                        </div>
                    )}
                </div>

                {/* Recommendations Section - Only show if searched and has results */}
                {hasSearched && recommendedProducts.length > 0 && (
                    <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Top Recommendations For You</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedProducts.map(product => (
                                <ProductCard key={product.id} product={product} highlight />
                            ))}
                        </div>
                    </section>
                )}

                {/* No Results Message */}
                {hasSearched && !isSearching && recommendedProducts.length === 0 && (
                    <div className="text-center mb-12 text-gray-500">
                        <p>No specific recommendations found. Check out our full collection below!</p>
                    </div>
                )}

                {/* All Products Section */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {hasSearched ? 'Other Products' : 'Featured Collection'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {otherProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;

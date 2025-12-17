import { Product } from '../data/products';

interface ProductCardProps {
    product: Product;
    highlight?: boolean;
}

export function ProductCard({ product, highlight }: ProductCardProps) {
    return (
        <div className={`
      relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md h-full flex flex-col
      ${highlight ? 'ring-2 ring-blue-500 scale-[1.02] shadow-blue-100' : 'border-gray-200'}
    `}>
            {highlight && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium z-10">
                    Recommended
                </div>
            )}
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{product.category}</span>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight mt-1">{product.name}</h3>
                    </div>
                    <span className="font-bold text-lg text-gray-900 ml-2">${product.price}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{product.description}</p>
                <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium rounded-lg text-sm transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
}

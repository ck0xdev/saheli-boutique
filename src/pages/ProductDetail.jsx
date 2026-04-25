import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products_saheli', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Merge the auto-generated ID with the document data
          setProduct({ id: docSnap.id, ...data });
          
          // Set the initial main image
          setActiveImage(data.images?.[0] || data.thumbnail || 'http://placehold.it/600x800/eeeeee/111111&text=No+Image');
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf9] flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="min-h-screen bg-[#fdfbf9] flex flex-col justify-center items-center py-32 animate-fade-in">
        <h2 className="text-4xl font-serif text-textMain mb-4">Product Not Found</h2>
        <p className="text-textLight mb-8 font-light">The item you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="bg-transparent text-textMain px-8 py-3 rounded-soft border border-textMain hover:bg-bgMain transition-colors font-medium">
          Return to Collection
        </Link>
      </div>
    );
  }

  // Generate WhatsApp Link
  const action = product.tag === 'Buy' ? 'buy' : (product.tag === 'Rent' ? 'rent' : 'book');
  const waMessage = `Hi, I am interested in looking to ${action} the ${product.name} (ID: ${product.productId || product.id}).`;
  const waLink = `https://wa.me/919265466420?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-[#fdfbf9] py-16 md:py-24 animate-fade-in">
      <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-4 sticky top-32">
          {/* Main Image */}
          <div className="aspect-[3/4] w-full rounded-soft overflow-hidden border border-borderSoft bg-white shadow-sm">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>
          
          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((imgUrl, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(imgUrl)}
                  className={`flex-shrink-0 w-20 h-24 rounded-soft overflow-hidden border-2 transition-colors ${activeImage === imgUrl ? 'border-accent' : 'border-transparent hover:border-borderSoft'}`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col">
          <span className="inline-block bg-white border border-borderSoft text-textMain text-xs font-medium px-4 py-1.5 rounded-soft shadow-sm w-max mb-6">
            {product.tag}
          </span>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-textMain leading-tight mb-4">
            {product.name}
          </h1>
          
          <p className="text-textLight font-mono text-sm mb-8">
            ID: {product.productId || product.id}
          </p>
          
          <div className="pb-8 border-b border-borderSoft mb-8">
            <h2 className="text-3xl text-textMain font-medium flex items-baseline gap-2">
              {product.priceDisplay}
            </h2>
            {product.buyoutPrice && (
              <p className="text-textLight mt-2 text-sm">
                Buy price: <span className="font-medium">{product.buyoutPrice}</span>
              </p>
            )}
          </div>

          <div className="prose prose-sm md:prose-base text-textLight font-light mb-10">
            <p className="mb-4">{product.shortDesc}</p>
            {/* If details is stored as HTML string in Firebase */}
            <div dangerouslySetInnerHTML={{ __html: product.details }} className="list-disc pl-5 space-y-2 mt-4" />
          </div>

          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full bg-accent text-bgMain px-8 py-4 rounded-soft border border-accent hover:bg-textMain hover:border-textMain transition-all duration-300 font-medium tracking-wide text-center text-lg shadow-sm"
          >
            Message us on WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./productDetail.css"; // You can style this separately

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setSelectedImage(res.data.image); // Set the main image by default
      } catch (error) {
        console.error("Failed to fetch product details", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handleAddToCart = () => {
    // Logic to add the product to the cart (could involve localStorage, context, or Redux)
    console.log(`Added ${quantity} x ${product.name} to cart`);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <div className="product-detail-image-gallery">
          <img
            src={`http://localhost:5000${selectedImage}`}
            alt={product.name}
            className="product-detail-image-main"
          />
          <div className="product-detail-thumbnails">
            {product.images && product.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000${img}`}
                alt={`Thumbnail ${index + 1}`}
                className="product-detail-image-thumbnail"
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        </div>
        
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p><b>Rs {product.price}</b></p>
          <p>Category: {product.category}</p>
          <p>{product.description}</p>

         

          {/* Reviews Section */}
          {product.reviews && (
            <div className="product-reviews">
              <h3>Customer Reviews</h3>
              {product.reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <p><b>{review.name}</b></p>
                  <p>{review.rating} stars</p>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

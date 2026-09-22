import { calculateDiscount } from "@/utils/calculateDiscount";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import Slider from "react-slick";

const ProductCards = ({ products, message }) => {
  var settings = {
    dots: products.length > 1 ? true : false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 500,
    adaptiveHeight: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div>
      <div
        className={`bg-gray-50 mt-2 p-2 rounded-lg block w-full max-w-[330px] ps-wrapper ${
          products.length > 1 ? " pb-6" : " "
        }`}
      >
        <Slider {...settings}>
          {products.map((product, index) => (
            <div
              key={index}
              className="p-4 relative bg-white  rounded-md mb-1 !flex  gap-4"
            >
              <div className="w-24 min-w-24">
                <div className="relative pb-[100%] w-full">
                  <img
                    src={product.productImage}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-md absolute top-0 left-0"
                  />
                </div>
              </div>
              <div>          
                <div className="text-sm font-semibold font-inter">
                  {product.title.slice(0, 80)}{product.title.length > 80 ? "..." : ""}
                </div>
                <div className="text-gray-500 my-1 text-sm  font-inter flex items-center gap-0.5 flex-wrap">
                  {product?.compareAtPrice != "N/A" && (
                    <s>{formatCurrency(parseFloat(product.compareAtPrice))}</s>
                  )}{" "}
                 <b> {formatCurrency(parseFloat(product.price))}</b>
                 {product?.compareAtPrice != "N/A" &&  <span className="text-white p-0.5 px-1 text-xs rounded-sm bg-red-500">{calculateDiscount(parseFloat(product.price), parseFloat(product.compareAtPrice))}% OFF</span>}
                </div>
                <button
                  onClick={() => {
                    window.parent.postMessage(
                      { action: "productRedirect", url: product.productHandle },
                      "*"
                    );
                  }}
                  className="px-4 py-2 text-sm rounded-lg custom-gradient text-white pp-details-btn"
                >
                  Product Details
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProductCards;

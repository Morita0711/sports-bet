import React from "react";
// import Slider from "react-slick";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

// import Carousel, {
//   slidesToShowPlugin,
//   arrowsPlugin,
// } from "@brainhubeu/react-carousel";

// import "@brainhubeu/react-carousel/lib/style.css";

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const carouselPlugins = (numberOfSlides) => [
//   "infinite",
//   {
//     resolve: slidesToShowPlugin,
//     options: {
//       numberOfSlides,
//     },
//   },
//   {
//     resolve: arrowsPlugin,
//     options: {
//       arrowLeft: (
//         <button className="mt-5 mr-10 focus:outline-none group">left</button>
//       ),
//       arrowRight: (
//         <button className="mt-5 focus:outline-none group">right</button>
//       ),
//       addArrowClickHandler: true,
//     },
//   },
// ];

//   breakpoints={{
//     1024: {
//       plugins: carouselPlugins(3),
//     },
//     1275: {
//       plugins: carouselPlugins(4),
//     },
//   }}
let res = {
  0: {
    items: 1,
    nav: true,
    loop: true,
    dots: false,
  },
  992: {
    items: 2,
    nav: true,
    loop: true,
    dots: false,
  },
  1000: {
    items: 3,
    nav: true,
    loop: true,
    dots: false,
  },
};
const AppCarousel = ({ children }) => {
  return (
    <OwlCarousel
      className="owl-theme"
      responsiveClass={true}
      loop
      margin={20}
      nav
      responsive={res}
    >
      {children}
    </OwlCarousel>
  );

  // var settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 4,
  //   slidesToScroll: 1,
  //   arrows: true,
  //   adaptiveHeight: false,
  // };

  // return <Slider {...settings}>{children}</Slider>;
};

// const AppCarousel = ({ children }) => {
//   if (process.browser)
//     return <Carousel plugins={carouselPlugins(4)}>{children}</Carousel>;
//   return null;
// };

export default AppCarousel;

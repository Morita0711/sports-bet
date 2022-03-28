import { convertQueryString } from "@/lib/helper";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

const LazyImage = ({ participantId, ...rest }) => {
  const imageRef = useRef(null);
  const {
    data: image,
    isIdle,
    isLoading,
    refetch,
  } = useQuery(
    ["team/logo", participantId],
    () =>
      axios
        .get(
          `/image/team_logo/?${convertQueryString({
            teamFK: participantId,
          })}`
        )
        .then((res) => Object.values(res.data.images)[0].value)
        .catch((err) => console.log(err)),
    { enabled: false }
  );
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0 && !image) {
        refetch().then(() => observer.unobserve(imageRef.current));
      }
    });
    if (imageRef.current) observer.observe(imageRef.current);
    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, [imageRef]);

  return (
    <div ref={imageRef}>
      {image ? (
        <img src={`data:image/png;base64, ${image}`} {...rest} />
      ) : (
        <svg
          className="mr-3 tw-w-6 tw-h-6 tw--ml-1 tw-animate-spin tw-text-black"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </div>
  );
};

export default LazyImage;

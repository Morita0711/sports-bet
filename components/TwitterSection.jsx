import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AppCarousel = dynamic(() => import("../components/AppCarousel"), {
  ssr: false,
});

const TwitterSection = ({ tweets }) => {
  const findUserFromResult = (index, author_id) => {
    const findIndex = tweets[index].includes.users.findIndex(
      (user) => user.id === author_id
    );
    return tweets[index].includes.users[findIndex];
  };

  return (
    <section className="realTime">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-3">
            <div className="section-title">
              <h2>Real Time</h2>
            </div>
          </div>
          <div className="col-lg-8 col-md-9">
            {/* <div className="realtime-list">
              <div className=" tw-flex tw-space-x-2 rend-menu">
                <a href="#" className="tw-border tw-font-Montserrat tw-text-xs">
                  Trending
                </a>
                <a href="#" className="tw-border tw-font-Montserrat tw-text-xs">
                  Latest
                </a>
                <a href="#" className="tw-border tw-font-Montserrat tw-text-xs">
                  Champions
                </a>
                <a href="#" className="tw-border tw-font-Montserrat tw-text-xs">
                  Team A
                </a>
                <a href="#" className="tw-border tw-font-Montserrat tw-text-xs">
                  Team B
                </a>
                <a href="#" className="tw-border tw-font-Montserrat tw-text-xs">
                  Team C
                </a>
                <a href="#" className="tw-border tw-font-Montserrat tw-text-xs">
                  Team D
                </a>
                <a href="#" className="tw-border tw-font-Montserrat tw-text-xs">
                  Team E
                </a>
              </div>
            </div> */}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <AppCarousel>
              {tweets.map((tweets, index) =>
                tweets.data.map((tweet) => (
                  <div
                    className="testimonial-item equal-height style-6 tw-flex tw-flex-col tw-h-full"
                    key={tweet.id}
                  >
                    <div>
                      <div className="testimonial-image cell-left">
                        <img
                          src={
                            findUserFromResult(index, tweet.author_id)
                              .profile_image_url
                          }
                          alt={tweet.author_id}
                          className="img-fluid tw-w-full"
                        />
                      </div>
                      <div className="cell-right">
                        <div className="testimonial-name">
                          {findUserFromResult(index, tweet.author_id).name}
                        </div>
                      </div>
                    </div>
                    <div className="testimonial-content quote tw-flex-1">
                      {tweet.text}
                    </div>
                    <div className="social_share">
                      <ul className="nav justify-content-between align-items-center">
                        <li>
                          <a href="#">
                            <i className="icofont-heart" />{" "}
                            <span className="count">
                              {tweet.public_metrics.like_count}
                            </span>
                          </a>
                        </li>

                        <li>
                          <a href="#">
                            <i className="icofont-chat" />{" "}
                            <span className="count">
                              {tweet.public_metrics.reply_count}
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </AppCarousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwitterSection;

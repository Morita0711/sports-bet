import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LazyImage from "@/components/LazyImage";
import { gapi } from "@/lib/ghost";
import { convertQueryString, convertToEST } from "@/lib/helper";
import { css } from "@emotion/css";
import { Listbox, Transition } from "@headlessui/react";
import axios from "axios";
import Twitter from "twitter-v2";
import dayjs from "dayjs";
import Head from "next/head";
import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
import TwitterSection from "@/components/TwitterSection";
import SportLeagues from "@/components/SportLeagues";
import SoccerLeagues from "@/components/SoccerLeagues";
import Link from "next/link";

const League = ({ league }) => {
  return (
    <div className="tem_box tem_box_1">
      <Link href={`/league/${league.id}?name=${league.name}`}>
        <a className="tw-truncate tw-inline-block">{league.name}</a>
      </Link>
    </div>
  );
};

const eventTime = [
  { type: "Jogos de Hoje", date: dayjs().format("YYYY-MM-DD") },
  {
    type: "Jogos Passados",
    date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  },
  { type: "Futuros Jogos", date: dayjs().add(1, "day").format("YYYY-MM-DD") },
];

const cricket = ({ featuredPosts, posts, tags, allUserTweets }) => {
  const [currentTime, setEventTime] = useState(eventTime[0]);
  const [currentSportEvent, setCurrentSportEvent] = useState(null);

  const { isLoading: loadingLeagues, data: leagues } = useQuery(
    "leagues",
    async () => {
      const { data } = await axios.get(
        `/tournament_template/list/?${convertQueryString({
          sportFK: 73,
        })}`
      );

      return data.tournament_templates;
    }
  );
  const {
    data: events,
    isLoading,
    isFetched,
  } = useQuery(
    ["events/fixture", currentTime.date],
    async ({ queryKey }) =>
      await axios
        .get(
          `/event/fixtures/?${convertQueryString({
            date: queryKey[1],
            sportFK: 73,
          })}`
        )
        .then((res) => {
          setCurrentSportEvent(Object.values(res.data?.events)[0]);
          return res.data;
        })
  );

  const getVenue = (event) => {
    let venueName;
    for (let objectId in event?.property) {
      if (event?.property[objectId].name === "VenueName") {
        venueName = event?.property[objectId].value;
      }
    }

    return venueName;
  };

  return (
    <>
      <Head>
        <title> Cricket | Bets</title>
      </Head>
      <Header />
      {/* {!isLoading && events.events.length != 0 && (
        <section className="main_score_sec bg_football">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-title">
                  <h2>Jogos de hoje</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-5">
                <div className="common_dropdown tw-h-full tw-max-h-[450px] tw-overflow-hidden ">
                  <Listbox value={currentTime} onChange={setEventTime}>
                    <div className="tw-relative">
                      <Listbox.Button
                        className={`tw-flex tw-p-4 tw-justify-between tw-items-center tw-uppercase tw-w-full ${css`
                          background: linear-gradient(
                            to right,
                            #ffffff 0%,
                            #b3b3b3 100%
                          );
                        `}`}
                      >
                        <span>{currentTime.type}</span>
                        <i className="icofont-rounded-down tw-border-black tw-rounded-full tw-h-5 tw-w-5 " />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className=" show tw-absolute tw-top-full tw-w-full tw-bg-white">
                          {eventTime
                            .filter((event) => event.type !== currentTime.type)
                            .map((ev, evIdx) => (
                              <Listbox.Option
                                key={evIdx}
                                value={ev}
                                className="tw-border-gray-300 tw-border-2"
                              >
                                {({ selected, active }) => (
                                  <span className="dropdown-item tw-cursor-pointer tw-p-4">
                                    {ev.type}
                                  </span>
                                )}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </Transition>{" "}
                    </div>
                  </Listbox>
                  <div
                    className="tw-h-full tw-overflow-y-auto tw-divide-y-2"
                    style={{ height: "calc(100% - 55px)" }}
                  >
                    {isLoading && (
                      <div className="tw-grid tw-place-content-center tw-min-h-[300px] tw-h-full tw-w-full">
                        <svg
                          className="mr-3 tw-w-6 tw-h-6 tw--ml-1 tw-animate-spin tw-text-black "
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
                      </div>
                    )}

                    {!isLoading && events.events.length == 0 && (
                      <div className="noEvents">No event found.</div>
                    )}
                    {!isLoading &&
                      Object.values(events?.events)?.map((sportEvent) => {
                        return (
                          <ul
                            key={sportEvent.id}
                            className="tw-text-black tw-flex tw-justify-between tw-items-center tw-py-3 tw-px-4 hover:tw-bg-gray-300/60 tw-transition hover:tw-cursor-pointer"
                            onClick={() => setCurrentSportEvent(sportEvent)}
                          >
                            <li className="tw-space-y-3">
                              {Object.values(sportEvent.event_participants).map(
                                (event_participant) => (
                                  <Fragment key={event_participant.id}>
                                    <div className="tw-flex tw-items-center tw-space-x-3">
                                      <LazyImage
                                        participantId={
                                          event_participant.participant.id
                                        }
                                        className="tw-w-6 tw-h-6"
                                      />
                                      <span>
                                        {event_participant.participant.name}
                                      </span>
                                    </div>
                                  </Fragment>
                                )
                              )}
                            </li>
                            <li className="tw-flex tw-flex-col">
                              <span className="tw-text-sm">start</span>
                              <span className="time ">
                                {convertToEST(sportEvent.startdate)} EST
                              </span>
                            </li>
                          </ul>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="col-md-7 tw-mt-5 md:tw-mt-0">
                <Transition
                  appear
                  show={Boolean(currentSportEvent)}
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  className="right_side md:tw-max-h-[450px] md:tw-h-full"
                >
                  {currentSportEvent && (
                    <>
                      <div className="scor_bord">
                        <ul className="nav justify-content-between align-items-center tw-flex-col md:tw-flex-row">
                          <li className="nav-item tw-self-center tw-w-full md:tw-w-[calc(50%-50px)] tw-flex tw-flex-col tw-items-center">
                            <LazyImage
                              className="tw-h-20 tw-w-20 !tw-mx-auto !md:tw-ml-auto"
                              participantId={
                                Object.values(
                                  currentSportEvent.event_participants
                                )[0].participant.id
                              }
                            />
                            <span className=" tw-inline-block tw-mt-3 tw-text-center tw-text-md md:tw-text-sm">
                              {
                                Object.values(
                                  currentSportEvent.event_participants
                                )[0].participant.name
                              }
                            </span>
                          </li>
                          <li className="nav-item tw-my-5 md:tw-my-0 tw-w-[100px] tw-grid tw-place-content-center">
                            <img
                              className="img-fluid center_fott"
                              alt="football"
                              src="img/icon_11.png"
                            />
                          </li>
                          <li className="nav-item tw-self-center tw-w-full md:tw-w-[calc(50%-50px)] tw-flex tw-flex-col tw-items-center">
                            <LazyImage
                              className="tw-h-20 tw-w-20 !tw-mx-auto !md:tw-ml-auto"
                              participantId={
                                Object.values(
                                  currentSportEvent.event_participants
                                )[1].participant.id
                              }
                            />
                            <span className=" tw-inline-block tw-mt-3 tw-text-center tw-text-md md:tw-text-sm">
                              {
                                Object.values(
                                  currentSportEvent.event_participants
                                )[1].participant.name
                              }
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="py-5 time_brd">
                        <div className="row align-items-center">
                          <div className="col-md-3">
                            <div className="start_bord">
                              <p className="start_bord">Start</p>
                              <h5>
                                {" "}
                                {convertToEST(currentSportEvent.startdate)} est
                              </h5>
                            </div>
                          </div>
                          <div className="col-md-9">
                            <div className="disc_bord">
                              <p>
                                {
                                  Object.values(
                                    currentSportEvent.event_participants
                                  )[0].participant.name
                                }{" "}
                                will be playing against{" "}
                                {
                                  Object.values(
                                    currentSportEvent.event_participants
                                  )[1].participant.name
                                }{" "}
                                today at the {getVenue(currentSportEvent)}{" "}
                                starting at{" "}
                                {convertToEST(currentSportEvent.startdate)} EST.
                                Don't Forget to checkout the team and players
                                stats
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="scr_tem_bord">
                        <div className="row">
                          <div className="px-2 col-md-4">
                            <div className="scrt_dis">
                              <p>lorem ipsum</p>
                              <h5>1.8</h5>
                            </div>
                          </div>
                          <div className="px-2 col-md-4">
                            <div className="scrt_dis">
                              <p>lorem ipsum</p>
                              <h5>8.11</h5>
                            </div>
                          </div>
                          <div className="px-2 col-md-4">
                            <div className="scrt_dis">
                              <p>lorem ipsum</p>
                              <h5>3.17</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Transition>
              </div>
            </div>
          </div>
        </section>
      )} */}
      <SoccerLeagues
        sportName="Críquete"
        id="Críquete"
        url="https://proxy.bets.com.br/cricket-t2/pt/tournaments.json?api_key=5zdhv3vy79n8uh57y7xfktj9"
        activeCont={{
          continent: "ÁSIA",
          countryName: "India",
          countryImg: "in",
        }}
      />

      <TwitterSection tweets={allUserTweets} />
      <div className="border_right">
        <div className="container">
          {" "}
          <img
            src="/img/bord_right.png"
            className="img-fluid tw-w-full"
            alt="border_left"
          />{" "}
        </div>
      </div>
      {/* Blog section */}
      <BlogSection featuredPosts={featuredPosts} posts={posts} tags={tags} />
      <Footer />
    </>
  );
};
export const getStaticProps = async () => {
  const featuredPosts = await gapi.posts.browse({
    include: "authors",
    filter: "featured:true",
  });

  const posts = await gapi.posts.browse({
    include: "authors",
    filter: "featured:false",
  });

  const client = new Twitter({
    bearer_token:
      "AAAAAAAAAAAAAAAAAAAAAIL3SgEAAAAAgr9ZjnLMIrzlu3nkyJBspiFz3nc%3Dl8d8p0ueOubnhMmvLSJBqdVNTdoWc4j0CoGsE5v3v6Jx4iEg4R",
  });

  const allUserTweets = [];
  let requiredUserTweetsIds = ["15911679", "33320098", "420535612", "14595245"];
  await Promise.all(
    requiredUserTweetsIds.map(async (item, index) => {
      const tweets = await client.get(`users/${item}/tweets`, {
        user: { fields: ["username", "name", "profile_image_url", "id"] },
        expansions: ["author_id"],
        max_results: "6",
        tweet: { fields: ["created_at", "public_metrics"] },
      });
      allUserTweets.push(tweets);
    })
  );

  const tags = await gapi.tags.browse();

  return {
    props: {
      featuredPosts,
      posts,
      tags,
      allUserTweets,
    },
    // every 5 minutes, it will fetch again
    revalidate: 60 * 5, // in seconds
  };
};
export default cricket;

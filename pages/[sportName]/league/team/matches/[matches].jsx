import Head from "next/head";
import Layout from "@/components/layouts/Layout";
import { useQuery } from "react-query";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import BlogSection from "@/components/BlogSection";
import Loader from "@/components/Loader";
//import gameJson from "../../../../../public/Json/game.json";
import Link from "next/link";
import week_days from "../../../../../public/Json/week_days.json";
import allMonths from "../../../../../public/Json/months.json";
import { Space, Table, Tag, Tooltip } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { teamLogoImg } from "@/lib/helper";
import { config } from "@/config";

const sportEventSummary = async (router) => {
  const gameRes = await fetch(config.gameAPI);
  const gameJson = await gameRes.json();
  const queryValue =
    router.query["matches"] ||
    router.asPath.match(new RegExp(`[&?]matches=(.*)(&|$)`));
  let sport = gameJson[queryValue];
  const res = await fetch(
    `https://proxy.bets.com.br/${sport.en_Name}/trial/${sport.api_version}/pt/competitors/${router.query.id}/summaries.json?api_key=${sport.api_key}`
  );
  return res.json();
};

export default function matches() {
  const router = useRouter();
  var { data: allMatches, status } = useQuery(
    ["sportEventSummary", router],
    () => sportEventSummary(router)
  );
  let gameName =
    router.query["name"] ||
    router.asPath.match(new RegExp(`[&?]name=(.*)(&|$)`));
  useEffect(() => {
    if (status == "success") {
      let d = allMatches.summaries.filter((event, index) => {
        event.indexKey = index;
        return (
          dayjs(event.sport_event.start_time).format("YYYY-MM-DD") <
          dayjs().format("YYYY-MM-DD")
        );
      });
    }
  }, [status]);
  const columns = [
    {
      title: "DATA",
      dataIndex: "sport_event",
      key: "1",
      render: (event) => {
        return (
          <span>
            {week_days[dayjs(event.start_time).format("dddd")].shortName}
            {", "}
            {dayjs(event.start_time).format("DD")}{" "}
            {allMonths[dayjs(event.start_time).format("MMMM")]}{" "}
            {dayjs(event.start_time).format("YYYY")}
          </span>
        );
      },
    },
    {
      title: "Jogo",
      dataIndex: "sport_event",
      key: "2",
      render: (event) => {
        return (
          <div className="img-main-detail">
            <div className="img-detail-fir">
              {event.competitors.findIndex(
                (item) =>
                  item.name.toLocaleLowerCase() == gameName.toLocaleLowerCase()
              ) == 0 ? (
                <>
                  <b>{event.competitors[0].name}</b>
                  {teamLogoImg(event.competitors[0].name)}
                </>
              ) : (
                <>
                  <span>{event.competitors[0].name}</span>
                  {teamLogoImg(event.competitors[0].name)}
                </>
              )}
            </div>
            <div className="img-detail-sec">
              <b className="past-game-score">
                {event.homeScore}
                {" - "}
                {event.awayScore}
              </b>
            </div>
            <div className="img-detail-the">
              {event.competitors.findIndex(
                (item) =>
                  item.name.toLocaleLowerCase() == gameName.toLocaleLowerCase()
              ) == 1 ? (
                <>
                  {teamLogoImg(event.competitors[0].name)}
                  <b>{event.competitors[1].name}</b>
                </>
              ) : (
                <>
                  {teamLogoImg(event.competitors[0].name)}
                  <span>{event.competitors[1].name}</span>
                </>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Resultado",
      dataIndex: "sport_event",
      key: "2",
      render: (event) => {
        let color = "green";
        let winnerText = "Win";
        if (event.match_tie) {
          winnerText = "Tie";
          color = "blue";
          return (
            <Tag color={color} key={winnerText}>
              {winnerText}
            </Tag>
          );
        } else {
          let winnderName = event.competitors.filter(
            (team) => team.id == event.winner_id
          );
          if (winnderName.length > 0) {
            if (winnderName[0].name != gameName) {
              winnerText = "Lose";
              color = "red";
            }
            return (
              <Tag color={color} key={winnerText}>
                {winnerText}
              </Tag>
            );
          } else {
            return "";
          }
        }
      },
    },
    {
      title: null,
      dataIndex: "sport_event",
      key: "action",
      render: (event) => (
        <Link href={`/game/${event.id}?sport=${gameName}`}>
          <span className="more-game">
            Mais <ArrowRightOutlined />
          </span>
        </Link>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Matches | Bets</title>
      </Head>
      <Layout>
        <section className="main_score_sec">
          <div className="container">
            {status === "error" && <p>Error fetching data</p>}
            {status === "loading" && <Loader />}
            {status === "success" && (
              <div className="row">
                <div className="col-md-12">
                  <div className="game-schedule">
                    <strong>Partidas Anteriores</strong>
                    <Table
                      className="past-game"
                      columns={columns}
                      size={"small"}
                      pagination={{ pageSize: 5 }}
                      dataSource={allMatches.summaries.filter(
                        (event, index) => {
                          event.indexKey = index;
                          event.sport_event.homeScore =
                            event.sport_event_status.home_score;
                          event.sport_event.awayScore =
                            event.sport_event_status.away_score;
                          event.sport_event.match_tie =
                            event.sport_event_status.match_tie;
                          event.sport_event.winner_id =
                            event.sport_event_status.winner_id;
                          return (
                            dayjs(event.sport_event.start_time).format(
                              "YYYY-MM-DD"
                            ) < dayjs().format("YYYY-MM-DD")
                          );
                        }
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="game-schedule">
                    <strong>Próximos Jogos</strong>
                    <Table
                      className="past-game"
                      columns={columns}
                      size={"small"}
                      pagination={{ pageSize: 5 }}
                      dataSource={allMatches.summaries
                        .filter((event, index) => {
                          event.indexKey = index;
                          event.sport_event.homeScore =
                            event.sport_event_status.home_score;
                          event.sport_event.awayScore =
                            event.sport_event_status.away_score;
                          event.sport_event.match_tie =
                            event.sport_event_status.match_tie;
                          event.sport_event.winner_id =
                            event.sport_event_status.winner_id;
                          return (
                            dayjs(event.sport_event.start_time).format(
                              "YYYY-MM-DD"
                            ) > dayjs().format("YYYY-MM-DD")
                          );
                        })
                        .reverse()}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <div className="border_right">
          <div className="container">
            <img
              src="/img/bord_left.png"
              className="img-fluid tw-w-full"
              alt="border_left"
            />
          </div>
        </div>
        <BlogSection />
      </Layout>
    </>
  );
}

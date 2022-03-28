import Head from "next/head";
import Layout from "@/components/layouts/Layout";
import { useQuery } from "react-query";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
//import tournamentJson from "../../public/Json/all_tournament.json";
import { Tooltip } from "antd";
import { Listbox } from "@headlessui/react";
import BlogSection from "@/components/BlogSection";
import axios from "axios";
import { convertQueryString, teamLogoImg } from "@/lib/helper";
import LazyImage from "@/components/LazyImage";
import { config } from "@/config";

const sportEventSummary = async (router) => {
  const queryValue =
    router.query["game"] ||
    router.asPath.match(new RegExp(`[&?]game=(.*)(&|$)`));
  const res = await fetch(
    `https://proxy.bets.com.br/soccer/trial/v4/en/sport_events/${queryValue}/summary.json?api_key=4v8qsm5w6pgcns228e6pz2vz`
  );
  return res.json();
};
const sportEventCommentry = async (router) => {
  const queryValue =
    router.query["game"] ||
    router.asPath.match(new RegExp(`[&?]game=(.*)(&|$)`));
  const eventComentryRes = await fetch(
    `https://proxy.bets.com.br/soccer/trial/v4/pt/sport_events/${queryValue}/timeline.json?api_key=4v8qsm5w6pgcns228e6pz2vz`
  );
  return eventComentryRes.json();
};
export default function game() {
  const router = useRouter();
  var { data, status } = useQuery(
    ["sportEventSummary", router],
    () => sportEventSummary(router),
    {
      enabled: router.query.game ? true : false,
    }
  );
  const res = useQuery(
    ["sportEventCommentry", router],
    () => sportEventCommentry(router),
    {
      enabled: router.query.game ? true : false,
    }
  );
  const eventCommentry = res.data;
  const eventCommentryStatus = res.status;

  const matchStatus = {
    not_started: "Não Foi Iniciado",
    started: "Iniciada",
    ended: "Finalizada",
  };
  const [liveMatch, setLiveMatch] = useState({ id: "sr:match:0" });
  const [activeBetItem, setActiveBetItem] = useState(0);
  const [games, setGames] = useState({});
  const [betMarkets, setBetMarkets] = useState([
    {
      marketName: "1X2",
      marketNameId: "3Way",
    },
    {
      marketName: "Vitória 1ª Parte",
      marketNameId: "1stHalfWin",
    },
    {
      marketName: "Ambas as Equipes Marcam",
      marketNameId: "bothTeamsToScore",
    },
    {
      marketName: "Total Mais/Menos",
      marketNameId: "totalOverUnder",
    },
    {
      marketName: "Total Intervalo",
      marketNameId: "halfTimeOverUnder",
    },
    {
      marketName: "1X2 + Prolongamento",
      marketNameId: "3WayOvertime",
    },
    {
      marketName: "Escanteios",
      marketNameId: "corners",
    },
    {
      marketName: "Resultado Exato",
      marketNameId: "correctScore",
    },
    {
      marketName: "Para Marcar Primeiro",
      marketNameId: "whoWillScoreFirst",
    },
    {
      marketName: "Diferença de Gols",
      marketNameId: "goalsDifference",
    },
    {
      marketName: "Hipótese Dupla",
      marketNameId: "doubleChance",
    },
  ]);
  const [market, setMarket] = useState({
    marketName: "1X2",
    marketNameId: "3Way",
  });
  useEffect(async () => {
    if (status == "success") {
      const spName = localStorage.getItem("sportName");
      //const spName = router.query.sportName;
      console.log("spName", spName);
      if (spName == "" || spName == undefined || spName == null) {
        //router.push("/");
      }
      let allTournament = [];
      let liveMatch = { id: router.query.game };
      if (spName) {
        //let allTournament = tournamentJson.sports[0].tournaments;
        const tournamentRes = await fetch(config.tournamentAPI);
        const tournamentJson = await tournamentRes.json();
        allTournament = Object.values(tournamentJson.sports).filter(
          (d) => d.name.toLowerCase() == spName.toLowerCase()
        );
      }
      for (let index = 0; index < allTournament.length; index++) {
        let matches = allTournament[index].matches;
        let match = [];
        if (matches != undefined) {
          match = matches.filter(
            (item) =>
              (item.homeTeamName.toLocaleLowerCase() ==
                data.sport_event.competitors[0].name.toLocaleLowerCase() &&
                item.awayTeamName.toLocaleLowerCase() ==
                  data.sport_event.competitors[1].name.toLocaleLowerCase() &&
                item.realCategoryName ==
                  data.sport_event.sport_event_context.category.name) ||
              (item.homeTeamName.toLocaleLowerCase() ==
                data.sport_event.competitors[1].name.toLocaleLowerCase() &&
                item.awayTeamName.toLocaleLowerCase() ==
                  data.sport_event.competitors[0].name.toLocaleLowerCase() &&
                item.realCategoryName ==
                  data.sport_event.sport_event_context.category.name)
          );
        }
        if (match.length > 0) {
          liveMatch = match[0];
          index = allTournament.length;
        }
      }
      setLiveMatch(liveMatch);
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>Game | Bets</title>
        <script>
          {`SIR("addWidget", "#lmtPlus", "match.lmtPlus", {layout: "topdown", scoreboard: "extended", momentum: "bars", tabsPosition: "top", goalBannerCustomBgColor: "#CAC6DB", matchId:${
            liveMatch.id.split(":")[2]
          }});`}
          {`SIR("addWidget", "#matchCommentary", "match.commentary", {matchId:${
            liveMatch.id.split(":")[2]
          }});`}
          {`SIR("addWidget", "#matchLineups", "match.lineUps", {matchId:${
            liveMatch.id.split(":")[2]
          }});`}
          {`SIR("addWidget", "#betAssist3Way", "betAssist.standalone", {market: "${
            market.marketNameId
          }", matchId:${liveMatch.id.split(":")[2]}});`}
        </script>
      </Head>
      <Layout>
        <section className="game-head">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {status === "error" && <p>Error fetching data</p>}
                {status === "loading" && (
                  <div className="tw-grid tw-place-content-center tw-min-h-[133px] tw-h-full tw-w-full">
                    <svg
                      className="mr-3 tw-w-6 tw-h-6 tw--ml-1 tw-animate-spin"
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
                {status === "success" && (
                  <>
                    <div className="game-title">
                      <h3>
                        {data.sport_event.sport_event_context.season.name}
                        {" - "}
                        {dayjs(data.sport_event.start_time).format(
                          "ddd, MMMM D, YYYY"
                        )}
                      </h3>
                      <p>
                        {data.sport_event.venue.name} (
                        {data.sport_event.venue.capacity})
                      </p>
                    </div>
                    <div className="row align-items-center">
                      <div className="col-md-4 col-4">
                        <div className="game-data">
                          <p>{data.sport_event.competitors[0].name}</p>
                          <div className="game-icon">
                            {/* <img src={"/img/langu_team.png"} alt="game_icon" /> */}
                            {teamLogoImg(router.query.sport)}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-4">
                        <div className="game-middel">
                          <h4>
                            {data.sport_event_status.match_status !==
                            "not_started" ? (
                              <>
                                {data.sport_event_status.home_score}-
                                {data.sport_event_status.away_score}
                              </>
                            ) : (
                              <>0-0</>
                            )}
                          </h4>
                          <p>
                            (Jogo é{" "}
                            {matchStatus[data.sport_event_status.match_status]})
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4 col-4">
                        <div className="game-right">
                          <div className="game-icon">
                            <img src={"/img/langu_team.png"} alt="game_icon" />
                          </div>
                          <p>{data.sport_event.competitors[1].name}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="">
            <div className="container">
              <div className="section-title abt_team_pl">
                <h2>Prévia da partida ao vivo</h2>
              </div>
            </div>
            <div className="container">
              <div className="section-title abt_team_pl">
                <div id="lmtPlus"></div>
              </div>
            </div>
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
        <section>
          <div className="faq_sec_in">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="section-title">
                    <h2>Comentário da partida</h2>
                  </div>
                  {/* <div id="matchCommentary"></div> */}
                  <div className="fun_bx">
                    {eventCommentryStatus === "error" && (
                      <p>Error fetching data</p>
                    )}
                    {eventCommentryStatus === "loading" && (
                      <div className="tw-grid tw-place-content-center tw-min-h-[133px] tw-h-full tw-w-full">
                        <svg
                          className="mr-3 tw-w-6 tw-h-6 tw--ml-1 tw-animate-spin"
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
                    {eventCommentryStatus === "success" && (
                      <div className="fact-item">
                        <div className="row">
                          <div className="col-md-12">
                            <ul className="nav">
                              {eventCommentry.timeline != undefined &&
                                eventCommentry.timeline
                                  .slice(0, eventCommentry.timeline.length / 2)
                                  .map((item) => {
                                    if (item.commentaries != undefined) {
                                      return item.commentaries.map(
                                        (comment, index) => (
                                          <li className="nav-item" key={index}>
                                            <span className="fun_img"></span>
                                            <span className="fun_txt">
                                              {comment.text}
                                            </span>
                                          </li>
                                        )
                                      );
                                    }
                                  })}
                              {eventCommentry.timeline == undefined && (
                                <li className="nav-item">
                                  <span className="fun_img"></span>
                                  <span className="fun_txt">
                                    Jogo não iniciado
                                  </span>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="border_left">
          <div className="container">
            <img
              src="/img/bord_right.png"
              className="img-fluid tw-w-full"
              alt="border_right"
            />
          </div>
        </div>
        <div className="border_right">
          <div className="container">
            <img
              src="/img/bord_left.png"
              className="img-fluid tw-w-full"
              alt="border_left"
            />
          </div>
        </div>
        <section>
          <div className="team-bets-main">
            <div className="container">
              <div className="section-title abt_team_pl row">
                <div className="col-md-6 col-12">
                  <h2>Bet Assist</h2>
                </div>
                <div className="col-md-6 col-12">
                  <div className="nav-menu popular_filter">
                    <ul className="nav filter-by">
                      <Listbox
                        as="li"
                        className="nav-item dropdown dropDown_com sport"
                      >
                        <Listbox.Button
                          as="a"
                          className="nav-link dropdown-toggle"
                          data-toggle="dropdown"
                          role="button"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {"Mostre tudo"}
                          <i className="icofont-rounded-down head_icon" />
                        </Listbox.Button>

                        <Listbox.Options className="filterinner-menu !tw-bg-white tw-space-y-2 focus:tw-outline-none tw-absolute tw-top-0 tw-transform tw-translate-y-10 dropdown-menu com_down show tw-w-full tw-mt-1">
                          {betMarkets.length > 0 &&
                            betMarkets.map((res, index) => (
                              <Listbox.Option
                                key={index}
                                value={res}
                                className="tw-font-light tw-my-10 tw-px-2 tw-text-base !tw-w-full"
                              >
                                {res.marketName}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </Listbox>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <div className="tem_2_year team-bets">
                    <ul className="nav team_nv_head">
                      <li className="nav-item">Mercado de Apostas</li>
                    </ul>
                    <ul className="nav nv_tm_sc">
                      {betMarkets.length > 0 &&
                        betMarkets.map((res, index) => (
                          <li
                            className={
                              activeBetItem == index
                                ? "active-bet-item nav-item bet-item-li"
                                : "nav-item bet-item-li"
                            }
                            key={index}
                            onClick={() => {
                              setMarket(res), setActiveBetItem(index);
                            }}
                          >
                            <b>{res.marketName}</b>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="tem_2_year">
                    <ul className="nav team_nv_head">
                      <li className="nav-item">{market.marketName}</li>
                    </ul>
                    <div className="bet-widgets" id="betAssist3Way"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="border_right">
          <div className="container">
            <img
              src="/img/bord_right.png"
              className="img-fluid tw-w-full"
              alt="border_right"
            />
          </div>
        </div>
        <BlogSection />
      </Layout>
    </>
  );
}

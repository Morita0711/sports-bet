import { Disclosure } from "@headlessui/react";
import Layout from "@/components/layouts/Layout";
import Head from "next/head";
import React, { useEffect, useState, Fragment } from "react";
import BlogSection from "@/components/BlogSection";
import axios from "axios";
import { useRouter } from "next/router";
import dayjs from "dayjs";
//import tournamentJson from "../../../../public/Json/all_tournament.json";
import week_days from "../../../../public/Json/week_days.json";
import allMonths from "../../../../public/Json/months.json";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Tooltip } from "antd";
//import gameJson from "../../../../public/Json/game.json";
import { isValidValue, leaguesLogoImg, teamLogoImg } from "@/lib/helper";
import Loader from "@/components/Loader";
import { config } from "@/config";

const eventTime = [
  { type: "Jogos de Hoje", date: dayjs().format("YYYY-MM-DD") },
  {
    type: "Jogos Passados",
    date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  },
  { type: "Futuros Jogos", date: dayjs().add(1, "day").format("YYYY-MM-DD") },
];

const TeamDetails = () => {
  const [currentTime, setEventTime] = useState(eventTime[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const updateCurrentTime = (value) => {
    let items = events.filter((event, index) => {
      if (value.type == "Jogos de Hoje") {
        return (
          dayjs(event.sport_event.start_time).format("YYYY-MM-DD") == value.date
        );
      } else if (value.type == "Jogos Passados") {
        let data =
          dayjs(event.sport_event.start_time).format("YYYY-MM-DD") < value.date;
        return data;
      } else {
        return (
          dayjs(event.sport_event.start_time).format("YYYY-MM-DD") > value.date
        );
      }
    });

    setEventTime(value);
  };
  const router = useRouter();
  const [player, setPlayer] = useState([]);
  const [market, setMarket] = useState({
    marketName: "3WAY",
    marketNameId: "3Way",
  });
  const [betMarkets, setBetMarkets] = useState([
    {
      marketName: "3WAY",
      marketNameId: "3Way",
    },
    {
      marketName: "1ª PARTE VITÓRIA",
      marketNameId: "1stHalfWin",
    },
    {
      marketName: "BOTH TEAMS SCORE",
      marketNameId: "bothTeamsToScore",
    },
    {
      marketName: "TOTAL MAIS / MENOS",
      marketNameId: "totalOverUnder",
    },
    {
      marketName: "TOTAL RANGE",
      marketNameId: "halfTimeOverUnder",
    },
    {
      marketName: "1X2 + EXTENSION",
      marketNameId: "3WayOvertime",
    },
    {
      marketName: "CORNERS",
      marketNameId: "cantos",
    },
    {
      marketName: "RESULTADO EXATO",
      marketNameId: "correctScore",
    },
    {
      marketName: "PARA DISCAR PRIMEIRO",
      marketNameId: "whoWillScoreFirst",
    },
    {
      marketName: "GOAL DIFFERENCE",
      marketNameId: "goalsDifference",
    },
    {
      marketName: "DUPLA HIPÓTESE",
      marketNameId: "doubleChance",
    },
  ]);
  const [teamInfo, setTeamInfo] = useState(null);
  const [playerProfile, setPlayerProfile] = useState({});
  const [activeBetItem, setActiveBetItem] = useState(0);
  const [game, setGame] = useState({});
  const [gameName, setGameName] = useState("");
  const [activePlayerSport, setActivePlayerSport] = useState(0);
  const [activePlayerCompetitor, setActivePlayerCompetitor] = useState(0);
  const [activePlayer, setActivePlayer] = useState(0);
  const [playerSummary, setPlayerSummary] = useState([]);
  const [sportFacts, setSportFacts] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [sportEvent, setSportEvent] = useState(null);
  const [teamProfile, setTeamProfile] = useState(null);
  const [sportEventStatistics, setSportEventStatistics] = useState(null);

  const [selectedSport, getSelectedSport] = useState("");

  useEffect(() => {
    if (router.query.id != undefined) ApiCall();
  }, [router.query.id]);
  useEffect(async () => {
    if (router.query.name != undefined) {
      setGameName(router.query.name);
      //  const spName = localStorage.getItem("sportName");
      const spName = router.query.sportName;

      if (spName == "" || spName == undefined || spName == null) {
        // router.push("/");
      }

      const gameRes = await fetch(config.gameAPI);
      const gameJson = await gameRes.json();

      let sport = Object.values(gameJson).filter(
        (d) => d.route.toLocaleLowerCase() == spName.toLocaleLowerCase()
      );

      const tournamentRes = await fetch(config.tournamentAPI);
      const tournamentJson = await tournamentRes.json();

      let allTournament = Object.values(tournamentJson.sports).filter(
        (d) => d.name.toLowerCase() == sport[0].tournament_Name.toLowerCase()
      );

      if (allTournament.length > 0) {
        for (
          let index = 0;
          index < allTournament[0].tournaments.length;
          index++
        ) {
          let matches = allTournament[0].tournaments[index].matches;
          if (matches) {
            let match = matches.filter(
              (item) => item.homeTeamName == router.query.name
            );
            if (match.length > 0) {
              setTeamInfo(match[0]);
              break;
            }
          }
        }
      }
    }
  }, [router.query.name]);
  useEffect(() => {
    //let selectedSport = localStorage.getItem("sportName");
    let selectedSport = router.query.sportName;

    if (selectedSport == null || selectedSport == undefined) {
      //router.push("/");
    } else {
      getSelectedSport(selectedSport);
    }
  }, [router.query.league]);
  const ApiCall = async () => {
    const gameRes = await fetch(config.gameAPI);
    const gameJson = await gameRes.json();
    let sport = gameJson[router.query.sport];
    setGame(sport);
    setSportFacts([]);
    setPlayerSummary([]);
    await axios({
      mehto: "get",
      url: `https://proxy.bets.com.br/${sport.en_Name}/trial/${sport.api_version}/pt/schedules/live/summaries.json?api_key=${sport.api_key}`,
    })
      .then((res) => {
        if (res.data.summaries.length > 0) {
          let livematch = res.data.summaries.filter(
            (d) =>
              d.sport_event.competitors[0].id == router.query.teamid ||
              d.sport_event.competitors[1].id == router.query.teamid
          );
          setLiveMatches(livematch);
        }
      })
      .catch((error) => console.log(error));

    await axios({
      method: "get",
      url: `https://proxy.bets.com.br/${sport.en_Name}/trial/${sport.api_version}/pt/competitors/${router.query.teamid}/summaries.json?api_key=${sport.api_key}`,
    })
      .then((res) => {
        if (res.data.summaries != undefined) {
          setIsLoading(false);
          setEvents(res.data.summaries);
        }
      })
      .catch((error) => console.log(error));
    await axios({
      method: "get",
      url: `https://proxy.bets.com.br/${sport.en_Name}/trial/${sport.api_version}/pt/competitors/${router.query.teamid}/profile.json?api_key=${sport.api_key}`,
    })
      .then((res) => {
        setTeamProfile(res.data);
        if (res.data.players != undefined) {
          setPlayer(res.data.players);
          axios({
            method: "get",
            url: `https://proxy.bets.com.br/${sport.en_Name}/trial/${sport.api_version}/pt/players/${res.data.players[0].id}/profile.json?api_key=${sport.api_key}`,
          })
            .then((res) => {
              setPlayerProfile(res.data.player);
              onClickToPlayer(res.data.player.id);
            })
            .catch((err) => console.log(err));
        } else {
          setPlayerProfile(null);
          setPlayer([]);
        }
      })
      .catch((err) => console.log(err));
  };
  const onClickToPlayer = async (id) => {
    if (
      game.en_Name != undefined &&
      game.api_version != undefined &&
      game.api_key != undefined
    ) {
      await axios({
        method: "get",
        url: `https://proxy.bets.com.br/${game.en_Name}/trial/${game.api_version}/pt/players/${id}/profile.json?api_key=${game.api_key}`,
      })
        .then((res) => {
          setPlayerProfile(res.data.player);
          axios({
            method: "get",
            url: `https://proxy.bets.com.br/${game.en_Name}/trial/${game.api_version}/pt/players/${id}/summaries.json?api_key=${game.api_key}`,
          })
            .then((res) => {
              setPlayerSummary(res.data.summaries);
              if (res.data.summaries.length > 0) {
                setSportEvent(res.data.summaries[0]);
                if (
                  res.data.summaries[0].statistics?.totals?.competitors
                    ?.length > 0
                ) {
                  setSportEventStatistics(
                    res.data.summaries[0].statistics.totals.competitors[0]
                  );
                }
                axios({
                  method: "get",
                  url: `https://proxy.bets.com.br/${game.en_Name}/trial/${game.api_version}/pt/sport_events/${res.data.summaries[0].sport_event.id}/fun_facts.json?api_key=${game.api_key}`,
                })
                  .then((res) => {
                    setSportFacts(res.data.facts);
                  })
                  .catch((err) => console.log(err));
              }
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <Head>
        <title>Equipe | Apostas</title>
        <script>{`SIR("addWidget", "#betAssist3Way", "betAssist.standalone", {market: "${
          market.marketNameId
        }", matchId:${
          teamInfo != null ? teamInfo.id.split(":")[2] : 0
        }});`}</script>
      </Head>
      <Layout>
        <section>
          <div className="container">
            <div className="row align-items-center justify-content-between">
              {teamProfile == null && <Loader />}
              {teamProfile != null && (
                <>
                  <div className="col-md-4">
                    <div className="lang_team">
                      {teamLogoImg(router.query.name)}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="section-title langs-title">
                      <h2>
                        {teamProfile != null && teamProfile.competitor.name}
                      </h2>
                      <p>
                        {teamProfile.competitions_played != undefined && (
                          <>
                            {teamProfile.competitor.name}, is a professional{" "}
                            team. There are total{" "}
                            {teamProfile.competitions_played.length}{" "}
                            competitions are alredy played. And the total number{" "}
                            of peridos of this game is{" "}
                            {teamProfile.periods.length}.
                          </>
                        )}
                        {teamProfile.competitions_played == undefined && (
                          <>
                            {teamProfile.competitor.name}, is a professional{" "}
                            {teamProfile.sport.name} team in{" "}
                            {teamProfile.category.name}
                            {teamProfile.competitor.gender != undefined && (
                              <>for {teamProfile.competitor.gender}.</>
                            )}
                            {teamProfile.manager != undefined && (
                              <>
                                Manager of {teamProfile.competitor.name} is{" "}
                                {teamProfile.manager.name} from{" "}
                                {teamProfile.manager.nationality}.
                              </>
                            )}
                            {isValidValue(teamProfile.venue) && (
                              <>
                                {teamProfile.competitor.name} venue is{" "}
                                {teamProfile.venue.name} and it's capacity is{" "}
                                {teamProfile.venue.capacity} at{" "}
                                {teamProfile.venue.city_name},
                                {teamProfile.venue.country_name}.
                                {isValidValue(teamProfile.jerseys) && (
                                  <>
                                    There are total {teamProfile.jerseys.length}{" "}
                                    jerseys of this team. You can find more info
                                    about this team just scroll down.
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
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
        <section className="main_score_sec bg_football">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-title">
                  <h2>Visão geral</h2>
                </div>
              </div>
            </div>
            {events.length == 0 && <Loader />}
            {events.length != 0 && (
              <div className="upcoming-game">
                {Object.values(
                  events.filter((event, index) => {
                    event.indexKey = index;
                    return event.sport_event_status.status === "closed";
                  })
                )
                  ?.slice(0, 3)
                  .reverse()
                  .map((sportEvent, index) => {
                    let winnerStatus = "W";
                    if (sportEvent.sport_event_status.match_tie) {
                      winnerStatus = "T";
                    } else {
                      let winnerId = sportEvent.sport_event_status.winner_id;
                      let winnderName =
                        sportEvent.sport_event.competitors.filter(
                          (team) => team.id == winnerId
                        );
                      if (winnderName.length > 0) {
                        if (winnderName[0].name != gameName) {
                          winnerStatus = "L";
                        }
                      }
                    }
                    let month = dayjs(sportEvent.sport_event.start_time).format(
                      "MMMM"
                    );
                    if (index != 0) {
                      let fmonth = dayjs(
                        events[sportEvent.indexKey + 1].sport_event.start_time
                      ).format("MMMM");
                      if (month == fmonth) {
                        month = "";
                      }
                    }
                    return (
                      <Link
                        href={`/${router.query.sportName}/league/team/game/${sportEvent.sport_event.id}?sport=${router.query.name}`}
                        key={index}
                      >
                        <div className="card-main">
                          <h3>{allMonths[month]}</h3>
                          <div className="card">
                            <div className="card-body">
                              <div className="card-head">
                                {teamLogoImg(router.query.name, false)}
                                <p>
                                  {dayjs(
                                    sportEvent.sport_event.start_time
                                  ).format("DD")}
                                  <br />{" "}
                                  <span>
                                    {
                                      week_days[
                                        dayjs(
                                          sportEvent.sport_event.start_time
                                        ).format("dddd")
                                      ].shortName
                                    }
                                  </span>
                                </p>
                              </div>
                              <div className="card-text">
                                <p>vs</p>
                                <strong>
                                  {
                                    sportEvent.sport_event.competitors.filter(
                                      (item) =>
                                        item.name.toLocaleLowerCase() !=
                                        gameName.toLocaleLowerCase()
                                    )[0].name
                                  }
                                </strong>
                              </div>
                            </div>
                            <hr />
                            <div className="card-bottom">
                              <p>
                                <Tooltip
                                  placement="top"
                                  title={
                                    <span>
                                      {winnerStatus == "L"
                                        ? "Match Lose"
                                        : winnerStatus == "T"
                                        ? "Match Tie"
                                        : "Match Win"}
                                    </span>
                                  }
                                >
                                  <strong
                                    className={
                                      winnerStatus == "L"
                                        ? "color-l"
                                        : winnerStatus == "T"
                                        ? "color-t"
                                        : "color-w"
                                    }
                                  >
                                    <span>{winnerStatus}</span>
                                  </strong>
                                </Tooltip>
                                {sportEvent.sport_event_status.home_score}-
                                {sportEvent.sport_event_status.away_score}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                {Object.values(
                  liveMatches.filter((event, index) => {
                    return event.sport_event_status.status === "live";
                  })
                )
                  .slice(0, 1)
                  .map((sportEvent, index) => {
                    return (
                      <Link
                        href={`/${router.query.sportName}/league/team/game/${sportEvent.sport_event.id}`}
                        key={index}
                      >
                        <div className="card-main">
                          <div className="card today-game">
                            <div className="card-body">
                              <div className="card-head">
                                {teamLogoImg(router.query.name, false)}
                                <p>
                                  {dayjs(
                                    sportEvent.sport_event.start_time
                                  ).format("DD")}
                                  <br />{" "}
                                  <span>
                                    {
                                      week_days[
                                        dayjs(
                                          sportEvent.sport_event.start_time
                                        ).format("dddd")
                                      ].shortName
                                    }
                                  </span>
                                </p>
                              </div>
                              <div className="card-text">
                                <p>vs</p>
                                <strong>
                                  {
                                    sportEvent.sport_event.competitors.filter(
                                      (item) =>
                                        item.name.toLocaleLowerCase() !=
                                        gameName.toLocaleLowerCase()
                                    )[0].name
                                  }
                                </strong>
                              </div>
                            </div>
                            <hr />
                            <div className="card-bottom">
                              <p>9:00 PM</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                {Object.values(
                  liveMatches.filter((event, index) => {
                    return event.sport_event_status.status === "live";
                  })
                ).length == 0 ? (
                  <div className="card-main">
                    <div className="card today-game">
                      <div className="card-body text-center">
                        <div className="card-head justify-content-center">
                          <p>
                            {dayjs().format("DD")}
                            <br /> <span>{dayjs().format("ddd")}</span>
                          </p>
                        </div>
                        <div className="card-text">
                          <strong>
                            Sem jogos
                            <br /> Mostrar
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {Object.values(
                  events.filter((event, index) => {
                    event.indexKey = index;
                    return event.sport_event_status.status === "not_started";
                  })
                )
                  ?.reverse()
                  .slice(0, 3)
                  .map((sportEvent, index) => {
                    let month = dayjs(sportEvent.sport_event.start_time).format(
                      "MMMM"
                    );
                    if (index != 0) {
                      let fmonth = dayjs(
                        events[sportEvent.indexKey + 1].sport_event.start_time
                      ).format("MMMM");
                      if (month == fmonth) {
                        month = "";
                      }
                    }
                    return (
                      <Link
                        href={`/${router.query.sportName}/league/team/game/${sportEvent.sport_event.id}`}
                        key={index}
                      >
                        <div className="card-main">
                          <h3>{allMonths[month]}</h3>
                          <div className="card">
                            <div className="card-body">
                              <div className="card-head">
                                {teamLogoImg(router.query.name, false)}
                                <p>
                                  {dayjs(
                                    sportEvent.sport_event.start_time
                                  ).format("DD")}
                                  <br />{" "}
                                  <span>
                                    {
                                      week_days[
                                        dayjs(
                                          sportEvent.sport_event.start_time
                                        ).format("dddd")
                                      ].shortName
                                    }
                                  </span>
                                </p>
                              </div>
                              <div className="card-text">
                                <p>vs</p>
                                <strong>
                                  {
                                    sportEvent.sport_event.competitors.filter(
                                      (item) =>
                                        item.name.toLocaleLowerCase() !=
                                        gameName.toLocaleLowerCase()
                                    )[0].name
                                  }
                                </strong>
                              </div>
                            </div>
                            <hr />
                            <div className="card-bottom">
                              <p>
                                {dayjs(
                                  sportEvent.sport_event.start_time
                                ).format("h:mm A")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            )}
            <div className="schedule-full">
              <Link
                href={`/matches/${router.query.sport}?id=${router.query.teamid}&name=${router.query.name}`}
              >
                <p>
                  Agenda lotada{" "}
                  <span>
                    <ArrowRightOutlined />
                  </span>
                </p>
              </Link>
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

        {/* <section className="realTime">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-title abt_team_pl">
                  <h2>SOBRE A EQUIPE</h2>
                </div>
              </div>
            </div>
            <div className="team-2_box">
              <div className="row align-items-center box-tem_2">
                <div className="col-md-4">
                  <div className="tem_2_year">
                    <ul className="nav team_nv_head">
                      <li className="nav-item">Nome do jogador</li>
                    </ul>
                    {
                      <ul className="nav nv_tm_sc stand_box_com_t">
                        {player.length > 0 &&
                          player.map((res, index) => (
                            <li
                              className={
                                activePlayer == index
                                  ? "nav-item active-player player-item"
                                  : "nav-item player-item"
                              }
                              key={index}
                              onClick={() => {
                                setActivePlayer(index),
                                  setSportEvent(null),
                                  setActivePlayerSport(0),
                                  setSportEventStatistics(null),
                                  onClickToPlayer(res.id);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <b>{res.name}</b>
                            </li>
                          ))}

                        {player.length == 0 ? (
                          <li className="nav-item player-item">
                            <b>Nenhum jogador para exibir</b>
                          </li>
                        ) : (
                          ""
                        )}
                      </ul>
                    }
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="team_2_bx">
                    {playerProfile != null ? (
                      <>
                        <h2>Perfil do jogador</h2>
                        <div className="team_3_desk">
                          <div className="pt-2 row justify-content-between g-md-2">
                            <div className="col-md-4 col-4">
                              <div className="first_team first_team_com">
                                <h3>Nome</h3>
                                <h4>
                                  {playerProfile.name == undefined
                                    ? "Não disponível"
                                    : playerProfile.name}
                                </h4>
                              </div>
                            </div>
                            <div className="col-md-4 col-4">
                              <div className="Secono_team first_team_com">
                                <h3>Modelo</h3>
                                <h4>
                                  {playerProfile.type == undefined
                                    ? "Não disponível"
                                    : playerProfile.type}
                                </h4>
                              </div>
                            </div>
                            <div className="col-md-4 col-4">
                              <div className="Third_team first_team_com">
                                <h3>Nacionalidade</h3>
                                <h4>
                                  {playerProfile.nationality == undefined
                                    ? "Não disponível"
                                    : playerProfile.nationality}
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 row justify-content-between g-md-2">
                            <div className="col-md-4 col-4">
                              <div className="first_team first_team_com">
                                <h3>Altura</h3>
                                <h4>
                                  {playerProfile.height == undefined
                                    ? "Não disponível"
                                    : playerProfile.height}
                                </h4>
                              </div>
                            </div>
                            <div className="col-md-4 col-4">
                              <div className="Secono_team first_team_com">
                                <h3>Peso</h3>
                                <h4>
                                  {playerProfile.weight == undefined
                                    ? "Não disponível"
                                    : playerProfile.weight}
                                </h4>
                              </div>
                            </div>
                            <div className="col-md-4 col-4">
                              <div className="Third_team first_team_com">
                                <h3>Número da camisa</h3>
                                <h4>
                                  {playerProfile.jersey_number == undefined
                                    ? "Não disponível"
                                    : playerProfile.jersey_number}
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 row justify-content-between g-md-2">
                            <div className="col-md-4 col-4">
                              <div className="first_team first_team_com">
                                <h3>Data de nascimento</h3>
                                <h4>
                                  {playerProfile.date_of_birth == undefined
                                    ? "Não disponível"
                                    : playerProfile.date_of_birth}
                                </h4>
                              </div>
                            </div>
                            <div className="col-md-4 col-4">
                              <div className="Secono_team first_team_com">
                                <h3>Local de nascimento</h3>
                                <h4>
                                  {playerProfile.place_of_birth == undefined
                                    ? "Não disponível"
                                    : playerProfile.place_of_birth}
                                </h4>
                              </div>
                            </div>
                            <div className="col-md-4 col-4">
                              <div className="Secono_team first_team_com">
                                <h3>Gênero</h3>
                                <h4>
                                  {playerProfile.gender == undefined
                                    ? "Não disponível"
                                    : playerProfile.gender}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="team_3_mobile">
                          <ul>
                            <li>
                              <p>Nome</p>
                              <span>
                                {playerProfile.name == undefined
                                  ? "Não disponível"
                                  : playerProfile.name}
                              </span>
                            </li>
                            <li>
                              <p>Modelo</p>
                              <span>
                                {playerProfile.type == undefined
                                  ? "Não disponível"
                                  : playerProfile.type}
                              </span>
                            </li>
                            <li>
                              <p>Nacionalidade</p>
                              <span>
                                {playerProfile.nationality == undefined
                                  ? "Não disponível"
                                  : playerProfile.nationality}
                              </span>
                            </li>
                            <li>
                              <p>Altura</p>
                              <span>
                                {playerProfile.height == undefined
                                  ? "Não disponível"
                                  : playerProfile.height}
                              </span>
                            </li>
                            <li>
                              <p>Peso</p>
                              <span>
                                {playerProfile.weight == undefined
                                  ? "Não disponível"
                                  : playerProfile.weight}
                              </span>
                            </li>
                            <li>
                              {" "}
                              <p>Número da camisa</p>
                              <span>
                                {playerProfile.jersey_number == undefined
                                  ? "Não disponível"
                                  : playerProfile.jersey_number}
                              </span>
                            </li>
                            <li>
                              <p>Data de nascimento</p>
                              <span>
                                {playerProfile.date_of_birth == undefined
                                  ? "Não disponível"
                                  : playerProfile.date_of_birth}
                              </span>
                            </li>
                            <li>
                              <p>Local de nascimento</p>
                              <span>
                                {playerProfile.place_of_birth == undefined
                                  ? "Não disponível"
                                  : playerProfile.place_of_birth}
                              </span>
                            </li>
                            <li>
                              <p>Gênero</p>
                              <span>
                                {playerProfile.gender == undefined
                                  ? "Não disponível"
                                  : playerProfile.gender}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-md-12">
                          <div className="Secono_team first_team_com">
                            <h4>Nenhuma informação do jogador para exibir</h4>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {playerProfile != null && (
              <div className="pt-2 row align-items-center box-tem_2">
                <div className="col-md-12">
                  <div className="team_2_bx">
                    <h2>Resumos do jogador</h2>
                    <div className="pt-2 row">
                      <div className="col-md-4">
                        <div className="main-league">
                          <div className="most-popular-lea second-layer">
                            <ul>
                              <li>{playerProfile.name}</li>
                            </ul>
                          </div>
                          <div className="regular-lea regular-height">
                            <ul>
                              {playerSummary.map((league, index) => (
                                <li
                                  key={index}
                                  onClick={() => {
                                    setActivePlayerSport(index);
                                    setActivePlayerCompetitor(0);
                                    setSportEventStatistics(null);
                                    setSportEvent(league);
                                    setSportEventStatistics(
                                      league.statistics.totals.competitors[0]
                                    );
                                  }}
                                  className={
                                    activePlayerSport == index
                                      ? "active-player-sport"
                                      : ""
                                  }
                                >
                                  {
                                    league.sport_event.sport_event_context
                                      .competition.name
                                  }
                                  ,
                                  {league.sport_event.start_time != undefined
                                    ? league.sport_event.start_time.split(
                                      "T"
                                    )[0]
                                    : ""}
                                  ({league.sport_event.venue.name})
                                  {league.sport_event_status.status}
                                </li>
                              ))}
                              {playerSummary?.length == 0 ? (
                                <li>Nenhum resumo do jogador encontrado</li>
                              ) : (
                                ""
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="main-league">
                          <div className="most-popular-lea second-layer">
                            <ul>
                              <li>
                                <i className="icofont-users-alt-1"></i>{" "}
                                Concorrentes
                              </li>
                            </ul>
                          </div>
                          <div className="regular-lea regular-height">
                            <ul>
                              {sportEvent != null &&
                                sportEvent.statistics != undefined &&
                                sportEvent.statistics.totals != undefined &&
                                sportEvent.statistics.totals.competitors.map(
                                  (league, index) => (
                                    <li
                                      key={index}
                                      onClick={() => {
                                        setActivePlayerCompetitor(index);
                                        setSportEventStatistics(league);
                                      }}
                                      className={
                                        activePlayerCompetitor == index
                                          ? "active-player-sport"
                                          : ""
                                      }
                                    >
                                      {league.name}
                                    </li>
                                  )
                                )}
                              {sportEvent == null || sportEvent.length == 0 ? (
                                <li>Concorrente não encontrado</li>
                              ) : (
                                ""
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="main-league">
                          <div className="most-popular-lea second-layer">
                            <ul>
                              <li>
                                <i className="icofont-bars"></i> Estatisticas
                              </li>
                            </ul>
                          </div>
                          <div className="regular-lea regular-height">
                            <ul>
                              {sportEventStatistics != null && (
                                <>
                                  <li className="sts-item">
                                    <span>Posse de bola</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .ball_possession
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Cartas Dadas</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .cards_given
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Escanteio</span>
                                    <span>
                                      {sportEventStatistics.corner_kicks}
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Faltas</span>
                                    <span>
                                      {sportEventStatistics.statistics.fouls}
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Chutes livres</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .free_kicks
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Chutes a gol</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .goal_kicks
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Lesões</span>
                                    <span>
                                      {sportEventStatistics.statistics.injuries}
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Offsides</span>
                                    <span>
                                      {sportEventStatistics.statistics.offsides}
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Cartas Vermelhas</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .red_cards
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Tiros bloqueados</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .shots_blocked
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Tiros fora do alvo</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .shots_off_target
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Tiros no alvo</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .shots_on_target
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Fotos salvas</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .shots_saved
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Total de arremessos</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .shots_total
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Substituições</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .substitutions
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Jogue dentro</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .throw_ins
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Cartões Amarelos</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .yellow_cards
                                      }
                                    </span>
                                  </li>
                                  <li className="sts-item">
                                    <span>Cartões amarelos vermelhos</span>
                                    <span>
                                      {
                                        sportEventStatistics.statistics
                                          .yellow_red_cards
                                      }
                                    </span>
                                  </li>
                                </>
                              )}
                              {sportEventStatistics == null ||
                                sportEventStatistics.length == 0 ? (
                                <li>Estatísticas não encontradas</li>
                              ) : (
                                ""
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section> */}
        <div className="border_right">
          <div className="container">
            <img
              src="/img/bord_right.png"
              className="img-fluid tw-w-full"
              alt="border_right"
            />
          </div>
        </div>
        {/* 
            =============================================================================================
                    FAQ & Fun Fact
            =============================================================================================
        */}
        {playerProfile != null && (
          <section className="faq_sec">
            <div className="faq_sec_in">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="section-title">
                      <h2>
                        Curiosidades
                        {playerProfile.name != undefined
                          ? ` by ${playerProfile.name}`
                          : ""}
                      </h2>
                    </div>
                    <div className="fun_bx">
                      {sportFacts.length > 0 && (
                        <ul className="nav fact-item">
                          {sportFacts.map((item, index) => (
                            <li className="item-list  item-second" key={index}>
                              <span className="fun_img"></span>
                              <span className="fun_txt">{item.statement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {sportFacts.length == 0 && (
                        <ul className="nav no-fact-item">
                          <li className="item-list item-second">
                            <span className="fun_img"></span>
                            <span className="fun_txt">Sem Curiosidade</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        <BlogSection />
      </Layout>
    </>
  );
};

export default TeamDetails;

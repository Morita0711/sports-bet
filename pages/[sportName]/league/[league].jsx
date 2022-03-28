import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import Layout from "@/components/layouts/Layout";
import Head from "next/head";
import BlogSection from "@/components/BlogSection";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
//import gameJson from "../../../public/Json/game.json";
import { leaguesLogoImg, teamLogoImg } from "@/lib/helper";
import Loader from "@/components/Loader";
import { connect } from "react-redux";
import { config } from "@/config";

let gameJson;

const LeagueDetails = ({ sportName }) => {
  const router = useRouter();
  let seasonId = "";
  if (router.query.league != undefined) {
    seasonId = router.query.league;
  }
  const [competititor, setCompetitors] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [seasonsInfo, setSeasonInfo] = useState(null);
  const [activeSeasonIndex, setactiveSeasonIndex] = useState(0);
  const [displayTeam, setDisplayTeam] = useState(10);
  const [selectedSport, getSelectedSport] = useState("");
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const fetchSeasonTeam = async (id, sportName, versio, apiKey) => {
    setCompetitors([]);

    await axios
      .get(
        `https://proxy.bets.com.br/${sportName}/trial/${versio}/pt/seasons/${id}/competitors.json?api_key=${apiKey}`
      )
      .then((res) => {
        setSelectedSeasonId(id);
        setDisplayTeam(10);
        setCompetitors(res.data.season_competitors);
      })
      .catch((error) => {
        console.log(error);
      });
    await axios
      .get(
        `https://proxy.bets.com.br/${sportName}/trial/${versio}/pt/seasons/${id}/info.json?api_key=${apiKey}`
      )
      .then((res) => {
        setSeasonInfo(res.data);
      })
      .catch((error) => {
        console.log(error);
        setSeasonInfo("");
      });
  };

  useEffect(async () => {
    if (router.query.league != undefined) {
      const gameRes = await fetch(config.gameAPI);
      gameJson = await gameRes.json();
      let sport = gameJson[router.query.sport];
      axios
        .get(
          `https://proxy.bets.com.br/${sport.en_Name}/trial/${sport.api_version}/pt/seasons.json?api_key=${sport.api_key}`
        )
        .then((res) => {
          let items = res.data.seasons.filter(
            (item) => item.competition_id == router.query.league
          );
          setSeasons(items);
          if (items.length > 0) {
            fetchSeasonTeam(
              items[0].id,
              sport.en_Name,
              sport.api_version,
              sport.api_key
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [router.query.league]);
  useEffect(() => {
    // let selectedSport = localStorage.getItem("sportName");
    let selectedSport = router.query.sportName;
    console.log("selectedSport", selectedSport);

    if (selectedSport == null || selectedSport == undefined) {
      //router.push("/");
    } else {
      getSelectedSport(selectedSport);
    }
  }, [router.query.league]);

  return (
    <>
      <Head>
        <title>League | Bets</title>
        <script>{`SIR("addWidget", "#tournamentPreview", "tournament.preview", {uniqueTournamentId:${
          router.query.league != undefined
            ? router.query.league.split(":")[2]
            : 0
        },disableMoreStats:true,isExpanded:true});`}</script>
      </Head>
      <Layout>
        <section className="League_banner bg_football">
          <div className="container">
            <div className="row align-items-center justify-content-between">
              {seasonsInfo == null && <Loader />}
              {seasonsInfo != null && seasonsInfo != "" && (
                <>
                  <div className="col-md-4">
                    <div className="lang_team">
                      {seasonsInfo != null &&
                        leaguesLogoImg(
                          router.query.continent,
                          router.query.country != undefined
                            ? router.query.country
                            : "",
                          router.query.name
                        )}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="section-title langs-title">
                      {seasonsInfo != null && (
                        <h2>{seasonsInfo.season.name}</h2>
                      )}
                      {seasonsInfo != null && (
                        <p>
                          {seasonsInfo.season.name}, compition of
                          {seasonsInfo.season.competition.name}, is a
                          professional
                          {seasonsInfo.season.sport.name} league in{" "}
                          {seasonsInfo.season.category.name} for{" "}
                          {seasonsInfo.season.competition.gender}. There are
                          overall {competititor.length} teams that compete for
                          the title every year between{" "}
                          {seasonsInfo.season.start_date} to{" "}
                          {seasonsInfo.season.end_date}. To follow team score,
                          team upcomming games and competititor, please visit
                          the team page of {seasonsInfo.season.name}
                          {/* The current holder of the
                      title is (CURRENT TEAM LEAGUE CHAMPION) and the team that
                      holds the most titles is (HIGHEST TITLE CHAMPION TEAM).
                      BETS tracks live football scores and (LEAGUE)
                      probabilities, results, statistics and top scorers. */}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
        <section className="main_sc_Leagues">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="section-title">
                  <h2>Temporadas</h2>
                </div>
                <div className="seasons-itme-list">
                  {seasons.length > 0 &&
                    seasons.map((team, index) => {
                      return (
                        <div className="team-item text-center" key={index}>
                          <div
                            className={
                              index == activeSeasonIndex
                                ? "active-seaon-item"
                                : "" + "season-item"
                            }
                            onClick={() => {
                              setactiveSeasonIndex(index);
                              fetchSeasonTeam(
                                team.id,
                                gameJson[router.query.sport].en_Name,
                                gameJson[router.query.sport].api_version,
                                gameJson[router.query.sport].api_key
                              );
                            }}
                          >
                            <span>{team.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  {seasons.length == 0 && (
                    <div>
                      <h3>Sem temporadas disponíveis</h3>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="section-title">
                  <h2>Times</h2>
                </div>
                <div className=" seasons-itme-list">
                  <div className="row">
                    {competititor.length > 0 &&
                      competititor.map((competititorItem, index) => {
                        return (
                          <div className="col-md-6" key={index}>
                            <div className="text-center competitor-item">
                              <div className="team-image-item">
                                {teamLogoImg(competititorItem.name)}
                                <Link
                                  href={`/${selectedSport}/league/team/demo?id=${selectedSeasonId}&teamid=${competititorItem.id}&sport=${router.query.sport}&name=${competititorItem.name}`}
                                >
                                  {competititorItem.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {competititor.length == 0 && (
                      <div>
                        <h3>Nenhuma equipe disponível</h3>
                      </div>
                    )}
                  </div>
                </div>
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
        <section className="rank_sec">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-title">
                  <h2>Antevisão do Torneio</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="sr-widget" id="tournamentPreview"></div>
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
        <BlogSection />
      </Layout>
    </>
  );
};
const mapStateToProps = ({ main }) => {
  return { sportName: main.sportName };
};
export default connect(mapStateToProps, null)(LeagueDetails);

import React, { useEffect, useState } from "react";
import league_datas from "../public/Json/soccer_leagues.json";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

const CriqueteLeagues = () => {
  const router = useRouter();
  const [secondScrrenLeague, setSecondScrrenLeague] = useState([]);
  const [thridScrrenLeague, setThirdScrrenLeague] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState({});
  const [selectedThridLeague, setSelectedThirdLeague] = useState({});
  const [secondView, setSecondView] = useState(false);
  const [thridView, setThridView] = useState(false);
  const [competitions, setCompetitions] = useState([]);
  const secondScreenOnly = [
    "INTERNATIONAL CLUBS",
    "INTERNATIONAL JUNIORS",
    "SIMULATED REALITY LEAGUE",
  ];
  useEffect(() => {
    axios
      .get(
        `http://api.sportradar.us/cricket-t2/en/tournaments.json?api_key=5zdhv3vy79n8uh57y7xfktj9`
      )
      .then((res) => {
        setCompetitions(res.data.competitions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const League = ({ league }) => {
    return (
      <Link
        //href={`/league/${league.uniqueTournamentId}?name=${league.league_name}`}
        href={`/league/${league.id}?name=${league.name}`}
      >
        {league.name}
      </Link>
    );
  };
  return (
    <section className="main_sc_Leagues">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-title">
              <h2>Ligas de futebol</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="main-league">
              <div className="most-popular-lea">
                <ul>
                  {league_datas.most_popular_leaguses.map((league) => (
                    <li
                      onClick={() =>
                        router.push(
                          `/league/${league.uniqueTournamentId}?name=${league.league_name}`
                        )
                      }
                    >
                      <img src={`/img/league_img/${league.league_img}`}></img>
                      {league.league_name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="regular-lea regular-moin-hei">
                <ul>
                  {league_datas.soccer_leaguses.map((league) => (
                    <li
                      onClick={() => {
                        setSelectedLeague({
                          league_name: league.league_name,
                          league_img: league.league_img,
                        });
                        if (secondScreenOnly.includes(league.league_name)) {
                          let a = [...competitions];
                          let allLeuges = a.filter(
                            (item) =>
                              item.category.name.toLocaleLowerCase() ==
                              league.league_name.toLocaleLowerCase()
                          );
                          setSecondScrrenLeague(allLeuges);
                        } else {
                          setSecondScrrenLeague(league.leagues);
                        }
                        setSecondView(true);
                        setThridView(false);
                      }}
                    >
                      {league.league_name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="main-league">
              <div className="most-popular-lea second-layer">
                <ul>{secondView && <li>{selectedLeague.league_name}</li>}</ul>
              </div>
              <div className="regular-lea regular-height">
                <ul>
                  {secondScrrenLeague.map((league) => (
                    <li
                      onClick={() => {
                        if (
                          secondScreenOnly.includes(selectedLeague.league_name)
                        ) {
                          router.push(
                            `/league/${league.id}?name=${league.name}`
                          );
                        } else {
                          setSelectedThirdLeague({
                            league_name: league.league_name,
                            league_img: league.league_img,
                          });
                          let a = [...competitions];
                          let allLeuges = a.filter(
                            (item) =>
                              item.category.name.toLocaleLowerCase() ==
                              league.league_name.toLocaleLowerCase()
                          );
                          setThirdScrrenLeague(allLeuges);
                          //setThirdScrrenLeague(league.leagues);
                          setThridView(true);
                        }
                      }}
                    >
                      {secondScreenOnly.includes(selectedLeague.league_name) ? (
                        league.name
                      ) : (
                        <>
                          <img
                            src={`/img/league_img/${league.league_img}`}
                          ></img>
                          {league.league_name}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="main-league">
              <div className="most-popular-lea second-layer">
                <ul>
                  {thridView && (
                    <li>
                      <img
                        src={`/img/league_img/${selectedThridLeague.league_img}`}
                      ></img>
                      {selectedThridLeague.league_name}
                    </li>
                  )}
                </ul>
              </div>
              <div className="regular-lea regular-height">
                <ul>
                  {thridView &&
                    thridScrrenLeague.map((league) => (
                      <li>
                        <League league={league} />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CriqueteLeagues;

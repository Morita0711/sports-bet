import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function BasketBallLeagues({ url, sportName, id }) {
  const [secondScrrenLeague, setSecondScrrenLeague] = useState([]);
  const [thridScrrenLeague, setThirdScrrenLeague] = useState([]);
  const [thridView, setThridView] = useState(false);
  const [activeCountry, setActiveCountry] = useState("");
  const [competitions, setCompetitions] = useState([]);
  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        let allCompetitions = [];
        if (sportName.toLocaleLowerCase() == "Críquete".toLocaleLowerCase()) {
          allCompetitions = res.data.tournaments;
        } else {
          allCompetitions = res.data.competitions;
        }
        let category = allCompetitions.map((data) => data.category.name);
        let uniqueCountry = [...new Set(category.map((item) => item))];
        uniqueCountry = uniqueCountry.sort();
        setActiveCountry(uniqueCountry[0]);
        setSecondScrrenLeague(uniqueCountry);
        let secondData = allCompetitions.filter(
          (data) => data.category.name == uniqueCountry[0]
        );
        setThridView(true);
        setThirdScrrenLeague(secondData);
        setCompetitions(allCompetitions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const League = ({ league }) => {
    return (
      <Link href={`/league/${league.id}?name=${league.name}&sport=${id}`}>
        {league.name}
      </Link>
    );
  };
  return (
    <div>
      <section className="main_sc_Leagues">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h2>Ligas de {sportName}</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="main-league">
                <div className="most-popular-lea second-layer">
                  <ul>
                    <li>País</li>
                  </ul>
                </div>
                <div className="regular-lea regular-height">
                  <ul>
                    {secondScrrenLeague.map((league, index) => (
                      <li
                        key={index}
                        className={
                          league.toLocaleLowerCase() ==
                          activeCountry.toLocaleLowerCase()
                            ? "active-league"
                            : ""
                        }
                        onClick={() => {
                          setActiveCountry(league);
                          let a = [...competitions];
                          let allLeuges = a.filter(
                            (item) =>
                              item.category.name.toLocaleLowerCase() ==
                              league.toLocaleLowerCase()
                          );
                          setThirdScrrenLeague(allLeuges);
                          setThridView(true);
                        }}
                      >
                        {league}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="main-league">
                <div className="most-popular-lea second-layer">
                  <ul>
                    {thridView && (
                      <li>
                        {/* <img
                          src={`/img/league_img/${selectedThridLeague.league_img}`}
                        ></img> */}
                        {activeCountry}
                      </li>
                    )}
                  </ul>
                </div>
                <div className="regular-lea regular-height">
                  <ul>
                    {thridView &&
                      thridScrrenLeague.map((league, index) => (
                        <li key={index}>
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
    </div>
  );
}

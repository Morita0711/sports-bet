import React, { useEffect, useState } from "react";
import league_datas from "../public/Json/soccer_leagues.json";
import countires_list from "../public/Json/countries.json";
import countries_short_name_list from "../public/Json/countries_short_names.json";
import most_popular_leagues from "../public/Json/most_popular_leagues.json";
import leagues_logos from "../public/Json/leagues_logos.json";
import futeboolCompetitions from "@/public/Json/SportCompetitiosJson/futeboolCompetitions.json";
import basketballCompetitions from "@/public/Json/SportCompetitiosJson/basketballCompetitions.json";
import tennisCompetitions from "@/public/Json/SportCompetitiosJson/tennisCompetitions.json";
import icehockeyCompetitions from "@/public/Json/SportCompetitiosJson/icehockeyCompetitions.json";
import baseballCompetitions from "@/public/Json/SportCompetitiosJson/baseballCompetitions.json";
import Link from "next/link";
import { useRouter } from "next/router";
import { leaguesLogoImg } from "@/lib/helper";
import axios from "axios";

const SoccerLeagues = ({ url, sportName, id, activeCont }) => {
  const router = useRouter();
  const [secondScrrenLeague, setSecondScrrenLeague] = useState([]);
  const [thridScrrenLeague, setThirdScrrenLeague] = useState([]);
  const [activeContinent, setActiveContinent] = useState(activeCont);
  const [competitions, setCompetitions] = useState([]);
  const [allContinent, setAllContinent] = useState([]);
  const getCountryMatchWithSportraderData = (
    resData,
    continent,
    country,
    imag,
    firstTime = false
  ) => {
    if (resData == undefined || resData == null) {
      resData = [...competitions];
    }
    let cntList = resData.map((d) => d.category.name);
    let allDataCountries = [...new Set(cntList.map((item) => item))];
    if (id.toLocaleLowerCase() == "Tênis".toLocaleLowerCase()) {
      let selectTennis = [];
      for (let index = 0; index < allDataCountries.length; index++) {
        const element = {
          alpha2: "",
          alpha3: "",
          continent: "América do Sul",
          id: 0,
          name: allDataCountries[index],
        };
        selectTennis.push(element);
      }
      setSecondScrrenLeague(selectTennis);
      let allLeuges = resData.filter(
        (leg) =>
          leg.category.name.toLocaleLowerCase() ==
          activeCont.countryName.toLocaleLowerCase()
      );
      setThirdScrrenLeague(allLeuges);
      setActiveContinent({
        continent: continent,
        countryName: activeCont.countryName,
        countryImg: "",
      });
    } else {
      let allSelectedCounties = countries_short_name_list.filter((cnt) => {
        if (
          cnt.continent.toLocaleLowerCase() == continent.toLocaleLowerCase()
        ) {
          let matchCnt = allDataCountries.filter(
            (d) => d.toLocaleLowerCase() == cnt.name.toLocaleLowerCase()
          );
          if (matchCnt.length > 0) {
            return cnt;
          }
        }
      });
      if (!firstTime && allSelectedCounties.length > 0) {
        country = allSelectedCounties[0].name;
        imag = allSelectedCounties[0].alpha2;
      }
      setSecondScrrenLeague(allSelectedCounties);
      let allLeuges = resData.filter(
        (leg) =>
          leg.category.name.toLocaleLowerCase() == country.toLocaleLowerCase()
      );
      setThirdScrrenLeague(allLeuges);
      setActiveContinent({
        continent: continent,
        countryName: country,
        countryImg: imag,
      });
    }
  };
  useEffect(() => {
    let resData = [];
    let allcontinent = countries_short_name_list.map((data) => data.continent);
    let uniquecontinent = [...new Set(allcontinent.map((item) => item))];
    setAllContinent(uniquecontinent);
    getCountryMatchWithSportraderData(
      resData,
      activeContinent.continent,
      activeContinent.countryName,
      activeContinent.countryImg,
      true
    );
    axios
      .get(url)
      .then((res) => {
        let resData = [];
        if (id.toLocaleLowerCase() == "Críquete".toLocaleLowerCase())
          resData = res.data.tournaments;
        else resData = res.data.competitions;

        setCompetitions(resData);
        let allcontinent = countries_short_name_list.map(
          (data) => data.continent
        );
        let uniquecontinent = [...new Set(allcontinent.map((item) => item))];
        setAllContinent(uniquecontinent);
        getCountryMatchWithSportraderData(
          resData,
          activeContinent.continent,
          activeContinent.countryName,
          activeContinent.countryImg,
          true
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const League = ({ league }) => {
    if (
      activeContinent.continent != undefined &&
      activeContinent.countryName != undefined
    ) {
      return (
        <Link
          href={`${sportName.replace(" ", "-")}/league/${league.id}?name=${
            league.name
          }&continent=${activeContinent.continent.toLocaleLowerCase()}&country=${activeContinent.countryName.toLocaleLowerCase()}&sport=${id}`}
        >
          {league.name}
        </Link>
      );
    }
    return <></>;
  };
  const redirectLeaguesPage = (league) => {
    let leagues = [...competitions];
    let allLeuges = leagues.filter(
      (item) => item.name.toLocaleLowerCase() == league.name.toLocaleLowerCase()
    );
    if (allLeuges.length > 0) {
      router.push(
        `/${sportName}/league/${allLeuges[0].id}?name=${allLeuges[0].name}&country=${league.country}&sport=${id}`
      );
    }
  };
  return (
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
              <div className="most-popular-lea first-section">
                <ul>
                  {most_popular_leagues[id].leagues.map((league, index) => (
                    <li key={index}>
                      {leaguesLogoImg("", league.country, league.name)}
                      <span
                        onClick={() => {
                          redirectLeaguesPage(league);
                        }}
                      >
                        {league.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="regular-lea regular-moin-hei">
                <ul>
                  {allContinent.map((continent, index) => {
                    return (
                      <li
                        key={index}
                        className={
                          continent.toLocaleLowerCase() ==
                          activeContinent.continent.toLocaleLowerCase()
                            ? "active-league"
                            : ""
                        }
                        onClick={() => {
                          let allSelectedCounties =
                            countries_short_name_list.filter(
                              (cnt) =>
                                cnt.continent.toLocaleLowerCase() ==
                                continent.toLocaleLowerCase()
                            );
                          getCountryMatchWithSportraderData(
                            null,
                            continent,
                            allSelectedCounties[0].name,
                            allSelectedCounties[0].alpha2
                          );
                        }}
                      >
                        {continent}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="main-league">
              <div className="most-popular-lea second-layer">
                <ul>
                  <li>{activeContinent.continent}</li>
                </ul>
              </div>
              <div className="regular-lea regular-height">
                <ul>
                  {secondScrrenLeague.map((league, index) => {
                    return (
                      <li
                        key={index}
                        className={
                          league.name.toLocaleLowerCase() ==
                          activeContinent.countryName.toLocaleLowerCase()
                            ? "active-league"
                            : ""
                        }
                        onClick={() => {
                          setActiveContinent({
                            ...activeContinent,
                            countryName: league.name,
                            countryImg: league.alpha2,
                          });
                          let a = [...competitions];
                          let allLeuges = a.filter(
                            (item) =>
                              item.category.name.toLocaleLowerCase() ==
                              league.name.toLocaleLowerCase()
                          );
                          setThirdScrrenLeague(allLeuges);
                        }}
                      >
                        <>
                          {league.alpha2 != "" && (
                            <img
                              src={`https://media.api-sports.io/flags/${league.alpha2}.svg`}
                            />
                          )}
                          {league.name}
                        </>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="main-league">
              <div className="most-popular-lea second-layer">
                <ul>
                  {
                    <li>
                      {activeCont.countryImg != "" && (
                        <img
                          src={`https://media.api-sports.io/flags/${activeContinent.countryImg}.svg`}
                        />
                      )}
                      {activeContinent.countryName}
                    </li>
                  }
                </ul>
              </div>
              <div className="regular-lea regular-height">
                <ul>
                  {thridScrrenLeague.map((league, index) => (
                    <li key={index}>
                      {leaguesLogoImg(
                        activeContinent.continent,
                        activeContinent.countryName,
                        league.name
                      )}
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

export default SoccerLeagues;

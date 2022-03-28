import React, { useState, Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import {
  MenuOutlined,
  CaretRightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { encrypt, leaguesLogoImg } from "@/lib/helper";
import Loader from "./Loader";
import { Collapse, Drawer, Input, Modal } from "antd";
import Button from "./Button";

const { Panel } = Collapse;

const sportsType = [
  {
    name: "Futebol",
    id: "futebol",
    url: "futebol",
    icon: "icofont-football-alt",
    className: "futebol-arrow",
  },
  {
    name: "Basquete",
    id: "Basquete",
    url: "basquete",
    icon: "icofont-basketball",
    className: "basquete-arrow",
  },
  { name: "Tênis", id: "Tênis", url: "tennis", icon: "icofont-tennis" },
  {
    name: "Futebol Americano",
    id: "Futebol_Americano",
    url: "futebol-americano",
    icon: "icofont-tennis",
    className: "futebol-americano-arrow",
  },
  {
    name: "Hockey no gelo",
    id: "Hockey_no_gelo",
    url: "hoquei",
    icon: "icofont-hockey",
    className: "hockey-arrow",
  },
  {
    name: "Beisebol",
    id: "Beisebol",
    url: "beisebol",
    icon: "icofont-baseball",
    className: "beisebol-arrow",
  },
  // {
  //   name: "Esportes",
  //   id: "Esportes",
  //   url: "esportes",
  //   icon: "icofont-tennis",
  //   className: "esportes-arrow",
  // },
  // {
  //   name: "MMA",
  //   id: "MMA",
  //   url: "mma",
  //   icon: "icofont-tennis",
  //   className: "mma-arrow",
  // },
  // {
  //   name: "Críquete",
  //   id: "Críquete",
  //   url: "criquete",
  //   icon: "icofont-tennis",
  //   className: "críquete-arrow",
  // },
  // {
  //   name: "Rúgbi",
  //   id: "Rúgbi",
  //   url: "rugbi",
  //   icon: "icofont-football-american",
  //   className: "rúgbi-arrow",
  // },
  // {
  //   name: "Boxe",
  //   id: "Boxe",
  //   url: "/boxe",
  //   icon: "icofont-tennis",
  //   className: "boxe-arrow",
  // },
];
const sportSubCategory = {
  futebol: ["Brasil", "Inglaterra", "Espanha", "Alemanha", "Internacional"],
  Basquete: [
    "Brasil",
    "Inglaterra",
    "Espanha",
    "Alemanha",
    "Itália",
    "Internacional",
  ],
  Tênis: [
    "Challenger",
    "WTA",
    "ITF Masculino",
    "ATP",
    "Taça Fed",
    "Taça Davis",
  ],
  Futebol_Americano: ["Estados Unidos da América", "Canadá", "Internacional"],
  Hockey_no_gelo: [
    "Áustria",
    "Suíça",
    "Rússia",
    "Estados Unidos da América",
    "Canadá",
    "Internacional",
  ],
  Beisebol: [
    "Itália",
    "República Dominicana",
    "México",
    "Estados Unidos da América",
    "Austrália",
    "Internacional",
  ],
  // Rúgbi: [
  //   "Rugby League",
  //   "Dominican Republic",
  //   "Mexico",
  //   "USA",
  //   "Australia",
  //   "International",
  // ],
  Críquete: [
    "India",
    "Emiratos Árabes Unidos",
    "Zimbabué",
    "Inglaterra",
    "África do Sul",
    "Internacional",
  ],
};

const Header = () => {
  const router = useRouter();
  const [allCompetition, setAllCompetition] = useState(null);
  const [seachModel, setSearchModal] = useState(false);
  const [mobileMenuItem, setMobileMenuItem] = useState({
    id: "futebol",
    name: "futebol",
  });
  const inputRef = useRef(null);
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  useEffect(() => {
    if (allCompetition == null) {
      let futebol =
        "https://proxy.bets.com.br/soccer/trial/v4/pt/competitions.json?api_key=4v8qsm5w6pgcns228e6pz2vz";
      let basketball =
        "https://proxy.bets.com.br/basketball/trial/v2/pt/competitions.json?api_key=rpqvd8kvav7srxnp7b2ua7mc";
      let tennis =
        "https://proxy.bets.com.br/tennis/trial/v3/pt/competitions.json?api_key=6d85gmk84bp3yjt47wdrjhs7";
      let americanfootball =
        "https://proxy.bets.com.br/americanfootball/trial/v2/pt/competitions.json?api_key=xnudbqdneze5vkhvgygvcvtk";
      let icehockey =
        "https://proxy.bets.com.br/icehockey/trial/v2/pt/competitions.json?api_key=wmkcsepkbshnw9wma85tec5c";
      let baseball =
        "https://proxy.bets.com.br/baseball/trial/v2/pt/competitions.json?api_key=rbvvhfkr7vmy9heqbt6djt3c";
      let rugby =
        "https://proxy.bets.com.br/rugby-league/trial/v3/pt/competitions.json?api_key=bext8ybg82fcbhjqgx4e4jjr";
      let cricket =
        "https://proxy.bets.com.br/cricket-t2/pt/tournaments.json?api_key=5zdhv3vy79n8uh57y7xfktj9";

      const requestOne = axios.get(futebol);
      const requestTwo = axios.get(basketball);
      const requestThree = axios.get(tennis);
      const requestFour = axios.get(americanfootball);
      const requestFive = axios.get(icehockey);
      const requestSix = axios.get(baseball);
      const requestSeven = axios.get(cricket);
      //const requestEight = axios.get(rugby);
      axios
        .all([
          requestOne,
          requestTwo,
          requestThree,
          requestFour,
          requestFive,
          requestSix,
          requestSeven,
          //requestEight,
        ])
        .then(
          axios.spread((...responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];
            const responseThree = responses[2];
            const requestFour = responses[3];
            const requestFive = responses[4];
            const requestSix = responses[5];
            const requestSeven = responses[6];
            // const requestEight = responses[7];
            let datas = {
              futebol: responseOne.data.competitions,
              Basquete: responseTwo.data.competitions,
              Tênis: responseThree.data.competitions,
              Futebol_Americano: requestFour.data.competitions,
              Hockey_no_gelo: requestFive.data.competitions,
              Beisebol: requestSix.data.competitions,
              Críquete: requestSeven.data.tournaments,
              //Rúgbi: requestEight.data.competitions,
            };
            setAllCompetition(datas);
          })
        )
        .catch((errors) => {
          console.error(errors);
        });
    }
  }, [allCompetition]);
  useEffect(() => {
    if (seachModel) {
      setTimeout(function () {
        inputRef.current.value = "";
        inputRef.current.focus();
      }, 10);
    }
  }, [seachModel]);

  // page change detect
  // menu hiding while page change
  useEffect(() => {
    const divEl = document.querySelector('.responsive-scroll .menu-one');
    const handleRouteChangeStart = (url) => {
      divEl.classList.add("menu-disabled");
    }
    const handleRouteChangeComplete = (url) => {
      divEl.classList.add("menu-disabled");
      console.log('done')
      setTimeout( function(){
        divEl.classList.remove("menu-disabled");
      },300)
    }
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
  }, [])

  return (
    <>
      <header id="header" className="tw-sticky tw-top-0 sm-top-unset">
        <div>
          <Modal
            style={{ top: 0 }}
            width={"67%"}
            visible={seachModel}
            footer={null}
            className="mode-change"
            onCancel={() => setSearchModal(false)}
          >
            <SearchOutlined />
            <div className="main-fild">
              <div className="field-container">
                <input
                  className="field-input"
                  id="inputid"
                  name="inputName"
                  type="text"
                  placeholder=" "
                  ref={inputRef}
                  autoComplete="off"
                />
                <label className="field-placeholder" for="inputName">
                  Pesquise escritores ou histórias
                </label>
              </div>
              <div className="results-text">
                <p>Pressione 'Enter' para ver todos os resultados</p>
              </div>
            </div>
          </Modal>
        </div>
        <div className="container">
          <div className="nav-custom">
            <div className="row align-items-center">
              <div className="col-lg-1">
                <Link href="/">
                  <img
                    src="/img/logo.png"
                    alt="Logo"
                    className="img-fluid tw-w-full"
                  />
                </Link>
              </div>
              <div className="col-lg-11">
                <div className="responsive-scroll">
                  <div className={!seachModel ? "serch-icon" : "search-open"}>
                    {/* {!seachModel && (
                      <SearchOutlined
                        onClick={() => {
                          setSearchModal(true);
                        }}
                      />
                    )} */}
                  </div>
                  <ul className="menu-one">
                    {sportsType.map((item, index) => {
                      return (
                        <li key={index} className="nav-item">
                          <Link href={"/" + item.url}>
                            <span className="drop-arrow">{item.name}</span>
                          </Link>
                          <div className="mega-menu">
                            <div className="menu-inner container" >
                              <div className="arrow-menu servis-arrow"></div>
                              {/* <div className="row justify-content-start"> */}
                              <div className="d-flex">
                                {sportSubCategory[item.id] != undefined &&
                                  sportSubCategory[item.id].map(
                                    (subItem, index) => {
                                      return (
                                        // <div className="col-lg-2 col-md-2" key={index}>
                                        <div className="flex-fill" key={index}>
                                          <h3 className="menu-title">
                                            {subItem}
                                          </h3>
                                          {allCompetition != null && (
                                            <ul>
                                              {allCompetition[item.id]
                                                .filter(
                                                  (comp) =>
                                                    comp.category.name.toLocaleLowerCase() ==
                                                    subItem.toLocaleLowerCase()
                                                )
                                                .slice(0, 10)
                                                .map((itm, index) => {
                                                  return (
                                                    <li
                                                      key={index}
                                                      onClick={() =>
                                                        localStorage.setItem(
                                                          "sportName",
                                                          item.url
                                                        )
                                                      }
                                                    >
                                                      {leaguesLogoImg(
                                                        "",
                                                        itm.category.name,
                                                        itm.name
                                                      )}
                                                      <Link
                                                        href={`/${item.url}/league/${itm.id}?name=${itm.name}&country=${itm.category.name}&sport=${item.id}`}
                                                      >
                                                        <span>{itm.name}</span>
                                                      </Link>
                                                    </li>
                                                  );
                                                })}
                                              {allCompetition[item.id].filter(
                                                (comp) =>
                                                  comp.category.name.toLocaleLowerCase() ==
                                                  subItem.toLocaleLowerCase()
                                              ).length == 0 && (
                                                <li>
                                                  <img
                                                    src={"/img/icon_11.png"}
                                                    alt="game_icon"
                                                  />
                                                  <a href="#">Comming Soon</a>
                                                </li>
                                              )}
                                            </ul>
                                          )}
                                          {allCompetition == null && <Loader />}
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                    <li className="extra-menu">
                      <span>•••</span>
                      <div className="mega-menu">
                        <div className="menu-inner">
                          <div className="arrow-menu servis-arrow"></div>
                          <div className="row justify-content-center">
                            <div className="col-lg-2">
                              <ul>
                                <li>Real Time</li>
                                <li>Week 14 NFL Picks</li>
                                <li>Futebol Americano</li>
                                <li>Hockey No Gelo</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* responsive menu */}

          <nav className="navbar navbar-expand-lg menu-two">
            <div className="">
              <div className="menu-aline">
                <a className="navbar-brand" href="/">
                  <img
                    src="/img/logo.png"
                    alt="Logo"
                    className="img-fluid tw-w-full"
                  />
                </a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#main_nav"
                  onClick={() => setDrawerVisibility(true)}
                >
                  <MenuOutlined style={{ color: "#fff" }} />
                </button>
              </div>
              <div className="collapse navbar-collapse main-bar" id="main_nav">
                <Collapse
                  accordion
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                >
                  {sportsType.map((item, index) => {
                    return (
                      <Panel header={item.name} key={index + 1}>
                        <Collapse
                          className="inner-text"
                          accordion
                          expandIconPosition="right"
                          expandIcon={({ isActive }) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                          )}
                        >
                          {sportSubCategory[item.id] != undefined &&
                            sportSubCategory[item.id].map((subItem, index) => {
                              return (
                                <Panel header={subItem} key={index + 1}>
                                  {allCompetition != null && (
                                    <ul>
                                      {allCompetition[item.id]
                                        .filter(
                                          (comp) =>
                                            comp.category.name.toLocaleLowerCase() ==
                                            subItem.toLocaleLowerCase()
                                        )
                                        .slice(0, 10)
                                        .map((itm, index) => {
                                          return (
                                            <li
                                              key={index}
                                              onClick={() =>
                                                localStorage.setItem(
                                                  "sportName",
                                                  item.url
                                                )
                                              }
                                            >
                                              {leaguesLogoImg(
                                                "",
                                                itm.category.name,
                                                itm.name
                                              )}
                                              <Link
                                                href={`/${item.url}/league/${itm.id}?name=${itm.name}&country=${itm.category.name}&sport=${item.id}`}
                                              >
                                                <span>{itm.name}</span>
                                              </Link>
                                            </li>
                                          );
                                        })}
                                      {allCompetition[item.id].filter(
                                        (comp) =>
                                          comp.category.name.toLocaleLowerCase() ==
                                          subItem.toLocaleLowerCase()
                                      ).length == 0 && (
                                        <li>
                                          <img
                                            src={"/img/icon_11.png"}
                                            alt="game_icon"
                                          />
                                          <a href="#">Comming Soon</a>
                                        </li>
                                      )}
                                    </ul>
                                  )}
                                </Panel>
                              );
                            })}
                        </Collapse>
                      </Panel>
                    );
                  })}
                </Collapse>
                {/* <div className="row">
                  <div className="col-9">
                    <div className="drop-menus">
                      <div className="container">
                        <div className="outer-wrapper">
                          <div className="inner-wrapper">
                            {sportSubCategory[mobileMenuItem.id] != undefined &&
                              sportSubCategory[mobileMenuItem.id].map(
                                (subItem, index) => {
                                  return (
                                    <div className="pseudo-item" key={index}>
                                      <h3>{subItem}</h3>
                                      <div className="col-md-12">
                                        {allCompetition != null && (
                                          <ul>
                                            {allCompetition[mobileMenuItem.id]
                                              .filter(
                                                (comp) =>
                                                  comp.category.name.toLocaleLowerCase() ==
                                                  subItem.toLocaleLowerCase()
                                              )
                                              .slice(0, 10)
                                              .map((itm, index) => (
                                                <li
                                                  key={index}
                                                  onClick={() =>
                                                    router.push(
                                                      `/league/${itm.id}?name=${itm.name}&sport=${mobileMenuItem.name}`
                                                    )
                                                  }
                                                >
                                                  {itm.name}
                                                </li>
                                              ))}
                                            {allCompetition[
                                              mobileMenuItem.id
                                            ].filter(
                                              (comp) =>
                                                comp.category.name.toLocaleLowerCase() ==
                                                subItem.toLocaleLowerCase()
                                            ).length == 0 && (
                                              <li>
                                                <img
                                                  src={"/img/icon_11.png"}
                                                  alt="game_icon"
                                                />
                                                <a href="#">Comming Soon</a>
                                              </li>
                                            )}
                                          </ul>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        </div>
                        <div className="pseduo-track"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="lead-menu">
                      <ul className="navbar-nav">
                        {sportsType.map((item, index) => {
                          return (
                            <li
                              className={
                                "nav-item dropdown has-megamenu text-capitalize " +
                                (item.id == mobileMenuItem.id
                                  ? "mobile-menu-active"
                                  : "")
                              }
                              key={index}
                              onClick={() => setMobileMenuItem(item)}
                            >
                              <span className="nav-link dropdown-toggle">
                                {item.name}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div> */}
              </div>
              {/* <div className="menuline">
                <div style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    onClick={() => setDrawerVisibility(true)}
                  >
                    <MenuOutlined style={{ color: "#fff" }} />
                  </Button>
                </div>

                <Drawer
                  placement="right"
                  closable={false}
                  onClose={() => setDrawerVisibility(false)}
                  visible={drawerVisibility}
                  getContainer={false}
                  // style={{ position: "absolute" }}
                >
                  <Collapse
                    accordion
                    expandIconPosition="right"
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  >
                    <Panel header="This is panel header 1" key="1">
                      <p>ghjghj</p>
                    </Panel>
                    <Panel header="This is panel header 2" key="2">
                      <p>ghjghj</p>
                    </Panel>
                    <Panel header="This is panel header 3" key="3">
                      <p>ghjghj</p>
                    </Panel>
                    <Panel header="This is panel header 1" key="4">
                      <p>ghjghj</p>
                    </Panel>
                    <Panel header="This is panel header 2" key="5">
                      <p>ghjghj</p>
                    </Panel>
                    <Panel header="This is panel header 3" key="6">
                      <p>ghjghj</p>
                    </Panel>
                  </Collapse>
                </Drawer>
              </div> */}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;

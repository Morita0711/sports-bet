import { convertQueryString, leaguesLogoImg } from "@/lib/helper";
import axios from "axios";
import Link from "next/link";
import { useQuery } from "react-query";
import most_popular_leagues from "../public/Json/most_popular_leagues";

const League = ({ league }) => {
  return (
    <Link
      href={`futebol/league/${league.id}?name=${league.name}&country=${league.country}&sport=futebol`}
    >
      <span className="tw-truncate tw-inline-block league-name">{league.name}</span>
    </Link>
  );
};

const apiCall = async () => {
  const { data } = await axios.get(
    `/tournament_template/list/?${convertQueryString({
      sportFK: 1,
    })}`
  );

  return data.tournament_templates;
};

const MaisPopular = () => {
  const { isLoading, data: leagues } = useQuery("leagues", apiCall);

  return (
    <section className="mais_popular">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="section-title">
              <h2>Mais Popular</h2>
            </div>
          </div>
          <div className="col-md-8"></div>
        </div>
        <div className="populer_tem">
          <div className=" tw-grid tw-grid-cols-1 lg:tw-grid-cols-4 tw-gap-4">
            {!isLoading &&
              most_popular_leagues["futebol"].leagues.map((league, index) => (
                <div className="tem_box tem_box_1" key={index}>
                  <div className="most-img">
                    {leaguesLogoImg("", league.country, league.name)}
                  </div>
                  <League key={index} league={league} />
                </div>
              ))}
          </div>
          {/* <div className=" tw-grid tw-grid-cols-1 lg:tw-grid-cols-4 tw-gap-4">
            {!isLoading &&
              Object.keys(leagues)
                .slice(0, 12)
                .map((id) => (
                  <div className="tem_box tem_box_1">
                    {" "}
                    <League key={id} league={leagues[id]} />
                  </div>
                ))}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default MaisPopular;

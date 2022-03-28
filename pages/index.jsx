import Head from "next/head";
import Twitter from "twitter-v2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TwitterSection from "@/components/TwitterSection";
import BlogSection from "@/components/BlogSection";
import { gapi } from "@/lib/ghost";
import Link from "next/link";
import MaisPopular from "@/components/MaisPopular";
import Router from "next/router";

export default function Home({ featuredPosts, posts, tags, allUserTweets }) {
  return (
    <>
      <Head>
        <title>Home | Bets</title>
      </Head>
      <Header />
      <section id="hero" className="banner_sec">
        <div className="banner_option">
          <div className="banner_point banner_point_1">
            <div className="container">
              <div className="banner_title">
                <h2>Esportes</h2>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <h3>
                    <Link href="/futebol">
                      <a>Futebol</a>
                    </Link>
                  </h3>
                </div>
                <div className="col-md-3">
                  <h3>
                    <Link href="/basquete">
                      <a>Basquete</a>
                    </Link>
                  </h3>
                </div>
                <div className="col-md-3">
                  <h3>
                    <Link href="/tennis">
                      <a>Tênis</a>
                    </Link>
                  </h3>
                </div>
                <div className="col-md-3">
                  <h3>
                    <Link href="/futebol-americano">
                      <a>Futebol Americano</a>
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="banner_point banner_point_2">
            <div className="container">
              <div className="row">
                <div className="col-md-3">
                  <h3>
                    <Link href="/hoquei">
                      <a>Hockey no gelo</a>
                    </Link>
                  </h3>
                </div>
                <div className="col-md-3">
                  <h3>
                    <Link href="/beisebol">
                      <a>Beisebol</a>
                    </Link>
                  </h3>
                </div>
                <div className="col-md-3">
                  <h3>
                    <Link href="/esportes">
                      <a>Esportes</a>
                    </Link>
                  </h3>
                </div>
                <div className="col-md-3">
                  <h3>
                    <Link href="/mma">
                      <a>MMA</a>
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="banner_point banner_point_3">
            <div className="container">
              <div className="row">
                {/* <div className="col-md-3">
                  <h3>
                    <Link href="/criquete">
                      <a>Críquete</a>
                    </Link>
                  </h3>
                </div> */}
                <div className="col-md-3">
                  <h3>
                    <Link href="/rugbi">
                      <a>Rúgbi</a>
                    </Link>
                  </h3>
                </div>
                <div className="col-md-3">
                  <h3>
                    <Link href="/boxe">
                      <a>Boxe</a>
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="spechegh" />
      </section>

      <main id="main">
        <MaisPopular />
        <div className="border_left">
          <div className="container">
            <img
              src="/img/bord_left.png"
              className="img-fluid tw-w-full"
              alt="border_left"
            />
          </div>
        </div>

        <TwitterSection tweets={allUserTweets} />

        <div className="border_right">
          <div className="container">
            <img
              src="/img/bord_right.png"
              className="img-fluid tw-w-full"
              alt="border_left"
            />
          </div>
        </div>

        {/* Blog section */}
        <BlogSection featuredPosts={featuredPosts} posts={posts} tags={tags} />
        <div className="border_right">
          <div className="container tw-py-3">
            <img
              src="/img/bord_right.png"
              className="img-fluid tw-w-full"
              alt="border_left"
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps = async () => {
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

  const featuredPosts = await gapi.posts.browse({
    include: "authors",
    filter: "featured:true",
  });

  const posts = await gapi.posts.browse({
    include: "authors",
    filter: "featured:false",
  });

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

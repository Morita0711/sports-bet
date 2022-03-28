import React, { useState, Fragment } from "react";
import dayjs from "dayjs";
import { Listbox, Transition } from "@headlessui/react";
import { useQuery } from "react-query";
import { ReadOutlined, FormOutlined } from "@ant-design/icons";

import { gapi } from "@/lib/ghost";
import { Tooltip } from "antd";

const people = [
  { id: 1, name: "Durward Reynolds", unavailable: false },
  { id: 2, name: "Kenton Towne", unavailable: false },
  { id: 3, name: "Therese Wunsch", unavailable: false },
  { id: 4, name: "Benedict Kessler", unavailable: true },
  { id: 5, name: "Katelyn Rohan", unavailable: false },
];

const blogAPI = async () => {
  const featuredPosts = await gapi.posts.browse({
    include: "authors",
    filter: "featured:true",
  });

  const posts = await gapi.posts.browse({
    include: "authors",
    filter: "featured:false",
  });

  return { posts, featuredPosts };
};

const tagAPI = async () => {
  const tags = await gapi.tags.browse();
  return tags;
};

const BlogSection = ({ featuredPosts, posts, tags }) => {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);

  const { isLoading: isLoadingBlog, data: blogData } = useQuery(
    "blog",
    blogAPI
  );

  const { isLoading: isLoadingTag, data: tagData } = useQuery("tags", tagAPI);

  const handleFilter = (tag) => {
    window.location.href = `${process.env.NEXT_PUBLIC_BLOG_URL}/tag/${tag.slug}`;
  };

  return (
    <>
      <section className="top_news">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="section-title">
                <h2>Manchetes</h2>
              </div>
            </div>
            <div className="col-md-8">
              <div className="nav-menu popular_filter ">
                <ul className="nav filter-by">
                  <li className="nav-item filter-tital">Filtrar por</li>
                  <Listbox
                    onChange={handleFilter}
                    value={selectedPerson}
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

                    <Listbox.Options className="!tw-bg-white tw-space-y-2 focus:tw-outline-none tw-absolute tw-top-0 tw-transform tw-translate-y-10 dropdown-menu com_down show tw-w-full tw-mt-1">
                      {!isLoadingTag &&
                        tagData.map((tag) => (
                          <Listbox.Option
                            key={tag.id}
                            value={tag}
                            className="tw-font-light tw-my-10 tw-px-2 tw-text-base !tw-w-full abc"
                          >
                            <p> {tag.name} </p>
                          </Listbox.Option>
                        ))}
                    </Listbox.Options>
                  </Listbox>
                </ul>
              </div>
            </div>
          </div>
          <div className="new_sec">
            <div className="row">
              {!isLoadingBlog &&
                blogData.featuredPosts.slice(0, 1).map((post) => (
                  <div className="col-md-7" key={post.id}>
                    <div className="new_inner">
                      <a
                        href={`${process.env.NEXT_PUBLIC_BLOG_URL}/${post.slug}`}
                      >
                        <div className="blog-image">
                          <img
                            className="img-fluid"
                            alt="blog_B"
                            src={post.feature_image}
                          />
                        </div>
                      </a>
                      <h3 className="tw-line-clamp-3">
                        <a
                          href={`${process.env.NEXT_PUBLIC_BLOG_URL}/${post.slug}`}
                        >
                          {post.title}
                        </a>
                      </h3>
                    </div>
                  </div>
                ))}
              <div className="col-md-5">
                <ul className="nav blog_box">
                  {!isLoadingBlog &&
                    blogData.featuredPosts.slice(1, 4).map((post) => {
                      return (
                        <>
                          <li key={post.id}>
                            <div className="blog-text">
                              <a
                                href={`${process.env.NEXT_PUBLIC_BLOG_URL}/${post.slug}`}
                              >
                                {post.title}
                              </a>
                              <div className="blog-info">
                                {post.authors != undefined &&
                                  post.authors.length > 0 && (
                                    <div className="blog-read">
                                      <span>
                                        <i class="icofont-user-alt-4"></i>
                                      </span>{" "}
                                      <span>
                                        <Tooltip
                                          placement="right"
                                          title={<span>Autor do Blog</span>}
                                        >
                                          {post.authors[0].name}
                                        </Tooltip>
                                      </span>
                                    </div>
                                  )}
                                {post.reading_time != undefined && (
                                  <Tooltip
                                    placement="left"
                                    title={<span>Tempo de leitura</span>}
                                  >
                                    <div className="blog-read">
                                      <ReadOutlined />{" "}
                                      <span>{post.reading_time}</span>
                                    </div>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                            <div className="tw-aspect-w-6 tw-aspect-h-1 tw-min-w-[100px] tw-ml-2 blog-img">
                              <img
                                alt="blog"
                                className="tw-object-contain"
                                src={post.feature_image}
                              />
                            </div>
                          </li>
                          {/* <li className="tw-aspect-w-6 tw-aspect-h-1 tw-min-w-[100px] tw-ml-2 blog-img">                            
                          </li> */}
                        </>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="border_left">
        <div className="container">
          <img
            src="/img/bord_left.png"
            className="img-fluid tw-w-full"
            alt="border_left"
          />
        </div>
      </div>
      <section className="blog_box_po">
        <div className="container">
          <div className="row">
            {!isLoadingBlog &&
              blogData.posts.slice(0, 6).map((post) => (
                <div
                  className="col-md-4 blo_box_com blo_box_1 tw-h-full tw-flex tw-flex-col"
                  key={post.id}
                >
                  <a
                    className="px-4 py-3"
                    href={`${process.env.NEXT_PUBLIC_BLOG_URL}/${post.slug}`}
                  >
                    <div className="blog-img">
                      <img
                        src={post.feature_image}
                        alt="blog"
                        className="img-fluid"
                      />
                    </div>
                    <h5 className="tw-line-clamp-3">{post.title}</h5>
                  </a>
                  <div className="px-4 auth_det tw-mt-auto">
                    <ul className="nav justify-content-between">
                      <li className="nav-item">
                        <a
                          className="text-gray-600"
                          href={`${process.env.NEXT_PUBLIC_BLOG_URL}/author/${post.primary_author.slug}`}
                        >
                          {post.primary_author.name}
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="#">
                          {dayjs(post.created_at).format("DD MMM YYYY")}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogSection;

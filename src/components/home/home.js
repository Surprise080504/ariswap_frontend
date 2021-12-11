import React, { useEffect } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import Hero from '../hero/hero';
import Auctions from '../auctions/home-auctions';
import TopSeller from '../top-seller/topseller2';
import Collections from '../collections/popular-collections';
import MyCollections from '../collections/my-collections'
import Explore from '../explore/explore-home';
import Work from '../work/work';
import Authors from '../authors/authors'

function Home() {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  return (
    <>
      <Hero />
       {/* <button onClick={()=>Redirection('/explore-all')}>test cases</button>  */}
      <Auctions />
      <TopSeller viewAll={"View All"} />
      <Collections />
      <Authors />
      {/* <MyCollections/>  */}
      {/* <Explore /> */}
      <Work />
    </>
  );
}

export default Home;
import React from 'react';
import SearchForBeer from './SearchForBeer';
import RenderBeerList from './RenderBeerList';
import Loader from './Loader';
import '../css/Beers.css';

const Beers = ({ beers, toggleFavourite, searchForBeer, deleteBeer }) => {
  const beerList = beers.length ? (
    <RenderBeerList
      beers={beers}
      toggleFavourite={toggleFavourite}
      deleteBeer={deleteBeer}
    />
  ) : (
    <Loader />
  );

  return (
    <main className="App__main">
      <SearchForBeer searchForBeer={searchForBeer} />
      <div className="container">{beerList}</div>
    </main>
  );
};

export default Beers;

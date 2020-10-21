import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Navbar from './components/Navbar';
import Beers from './components/Beers';
import Favourites from './components/Favourites';
import Loader from './components/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import EditBeer from './components/EditBeer';

const perPage = 10;

function App() {
  const [items, setItems] = useState([]);
  const [favourites, setFavourites] = useState(
    localStorage.getItem('Favourites')
      ? JSON.parse(localStorage.getItem('Favourites'))
      : []
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const toggleFavourite = async (e, id) => {
    const beer = items.find((item) => item.id === id);
    let favs;
    if (!beer.isFavourite) {
      e.target.className = 'fas fa-star';
      e.target.setAttribute('title', 'Remove from Favourites');
      favs = [...favourites, beer];
    } else {
      e.target.className = 'far fa-star';
      e.target.setAttribute('title', 'Add to Favourites');
      favs = favourites.filter((favourite) => favourite.id !== id);
    }
    beer.isFavourite = !beer.isFavourite;
    setFavourites(favs);
    localStorage.setItem('Favourites', JSON.stringify(favourites));
  };

  const deleteBeer = async (id) => {
    const beers = items.filter((item) => item.id !== id);
    setItems(beers);
  };

  const checkIfFavourite = (id) => {
    const isFavourite = favourites.find((favourite) => favourite.id === id);
    if (isFavourite) return true;
    return false;
  };

  const searchForBeer = (beer) => {
    const values = [];
    fetch(
      `https://api.punkapi.com/v2/beers?beer_name=${beer}&per_page=${perPage}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(
            `The connection ended with status ${res.status}${
              res.statusText ? ': ' + res.statusText : ''
            }`
          );
        }
      })
      .then((json) => {
        if (!json.length)
          return alert("We're sorry, we could not find such a beer :(");
        json.forEach((item) => {
          const beer = {
            id: item.id,
            name: item.name,
            tagline: item.tagline,
            firstBrewed: item.first_brewed,
            desc: item.description,
            imageURL: item.image_url,
            isFavourite: checkIfFavourite(item.id),
          };
          values.push(beer);
        });
        setItems(values);
      })
      .catch((error) => {
        setError(error);
        alert(error);
      });
  };

  const fetchMoreData = () => {
    setPage(page + 1);
  };

  const fetchData = () => {
    const values = [];
    fetch(`https://api.punkapi.com/v2/beers?page=${page}&per_page=${perPage}`)
      .then((res) => {
        if (res.ok) {
          setIsLoaded(true);
          return res.json();
        } else {
          throw new Error(
            `The connection ended with status ${res.status}${
              res.statusText ? ': ' + res.statusText : ''
            }`
          );
        }
      })
      .then((json) => {
        if (!json.length) setHasMore(false);
        else {
          json.forEach((item) => {
            const beer = {
              id: item.id,
              name: item.name,
              tagline: item.tagline,
              firstBrewed: item.first_brewed,
              desc: item.description,
              imageURL: item.image_url,
              isFavourite: checkIfFavourite(item.id),
            };
            values.push(beer);
          });
          setItems([...items, ...values]);
          localStorage.setItem('beers', JSON.stringify([...items, ...values]));
        }
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
        alert(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, perPage]);

  useEffect(() => {
    if (!items.length) fetchData();
  }, [items]);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Navbar />
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <InfiniteScroll
                dataLength={items.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<Loader />}
                endMessage="The End, No more beer"
              >
                <Beers
                  beers={items}
                  toggleFavourite={toggleFavourite}
                  deleteBeer={deleteBeer}
                  searchForBeer={searchForBeer}
                />
              </InfiniteScroll>
            )}
          />
          <Route
            path="/favourites"
            render={() => (
              <Favourites
                beers={favourites}
                toggleFavourite={toggleFavourite}
              />
            )}
          />
          <Route path="/edit/:id" render={() => <EditBeer save={setItems} />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

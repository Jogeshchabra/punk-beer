import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import '../css/EditBeer.css';

const EditBeer = (props) => {
  let { id } = useParams();
  let history = useHistory();
  const beers = [...JSON.parse(localStorage.getItem('beers'))];
  const beer = beers.find((beer) => beer.id == id);

  const [name, setName] = useState(beer.name);
  const [tagline, setTagline] = useState(beer.tagline);
  const [desc, setDesc] = useState(beer.desc);

  const saveBeer = () => {
    beer.name = name;
    beer.tagline = tagline;
    beer.desc = desc;

    props.save(beers);
    history.goBack();
  };

  return (
    <div className="edit_card" key={beer.id}>
      <div className="card__col">
        <img className="edit_card__img" src={beer.imageURL} alt={beer.name} />
        <p className="card__text card__text--sm">
          First brewed: {beer.firstBrewed}
        </p>
      </div>
      <div className="card__content">
        <input
          className="edit"
          onChange={(e) => setName(e.target.value)}
          value={name}
        ></input>
        <input
          className="edit"
          onChange={(e) => setTagline(e.target.value)}
          value={tagline}
        ></input>
        <input
          className="edit"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
        ></input>
        <button className="customBtn" onClick={saveBeer}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditBeer;

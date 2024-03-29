import React from 'react'
import Carousel from "react-elastic-carousel";

function Carousel1({items}) {

    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 2 },
        { width: 768, itemsToShow: 3 },
        { width: 1200, itemsToShow: 4 },
      ];
  return (
    <Carousel breakPoints={breakPoints}>
    {items.map((e, index) => (
      <div
        key={index}
        className="d-flex flex-column justify-content-center align-items-center " >
     <img
          src={e.cover}
          alt="taswira"
          className="img-fluid rounded-circle"
          style={{ width: "150px", height: "150px" }}
        />
        <div className="name">
          <h2>{e.name}</h2>
          <span>{e.post}</span>
        </div>
        <p className="d-flex justify-content-center align-items-center ">
          {e.desc || e.content}
        </p>
      </div>
    ))}
  </Carousel>
  )
}

export default Carousel1

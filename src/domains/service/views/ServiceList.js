import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../../store/service";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import AddButton from "../../../components/buttons/AddButton";


export default function ServiceList() {
  const dispatch = useDispatch();
  const servicesStore = useSelector((state) => state.service.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <div>
      <Link to="create-service">
        <AddButton content={"Create a new service"} />
      </Link>
      <div class="card mb-3">
        {servicesStore.items.map((elem, i) => (
          <div class="row no-gutters" key={i}>
            <div class="col-md-4">
              <img
                src={elem.cover?.path}
                class="card-img"
                alt={elem.cover?.alt}
              />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">{elem.name}</h5>
                <p class="card-text">
                  {elem.description}
                </p>
              </div>
              <Link to={`service/${elem.id}`}>Go to Details</Link>
              <div>
                <Link to={`edit-service/${elem.id}`}>Edit this service</Link>
              </div>
         
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItem } from '../services/api';
import './ItemDetail.css';

function ItemDetail() {
  const { id } = useParams();
  const [tool, setTool] = useState(undefined);

  useEffect(() => {
    let cancelled = false;

    getItem(id)
      .then((data) => {
        if (!cancelled) setTool(data);
      })
      .catch(() => {
        if (!cancelled) setTool(null);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (tool === undefined) {
    return (
      <div className="item-detail">
        <p>Loading…</p>
      </div>
    );
  }
import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getToolById,
} from "../services/tools";

import "./ItemDetail.css";


function ItemDetail() {
  const { id } = useParams();

  const [tool, setTool] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let isMounted = true;

    const loadTool =
      async () => {
        try {
          setLoading(true);

          const data =
            await getToolById(id);

          if (isMounted) {
            setTool(data);
            setError("");
          }
        } catch (error) {
          if (isMounted) {
            setError(
              error.message ||
                "Unable to load this tool."
            );
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    loadTool();

    return () => {
      isMounted = false;
    };
  }, [id]);


  if (loading) {
    return (
      <div className="item-detail">
        <p>
          Loading tool...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="item-detail">
        <p>{error}</p>

        <Link to="/browse-tools">
          Back to Browse Tools
        </Link>
      </div>
    );
  }


  if (!tool) {
    return (
      <div className="item-detail">
        <p>
          Tool not found.
        </p>

        <Link to="/browse-tools">
          Back to Browse Tools
        </Link>
      </div>
    );
  }


  return (
    <div className="item-detail">
      <Link to="/tools" className="back-link">&larr; Back to Browse Tools</Link>
      <h2>{tool.name}</h2>
      <p className="item-condition">Condition: {tool.condition}</p>
      <p>{tool.description}</p>
      <p className="item-rate">Status: {tool.status}</p>
      <Link to={`/payment/${tool.id}`} className="borrow-btn">
        Borrow this item

      <Link
        to="/browse-tools"
        className="back-link"
      >
        &larr; Back to Browse Tools
      </Link>


      <h2>
        {tool.name}
      </h2>


      <p className="item-condition">
        Condition:{" "}
        {tool.condition ||
          "Not specified"}
      </p>


      <p>
        {tool.description ||
          "No description available."}
      </p>


      <p>
        Status:{" "}
        {tool.status ||
          "Available"}
      </p>


      <Link
        to="/auth"
        className="borrow-btn"
      >
        Log in to Request
      </Link>

    </div>
  );
}


export default ItemDetail;
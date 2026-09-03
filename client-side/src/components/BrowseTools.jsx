import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  MapPin,
  ShoppingCart,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

import {
  getTools,
} from "../services/tools";

import useAuth from "../hooks/useAuth.js";

import "./BrowseTools.css";


const ITEMS_PER_PAGE = 6;


const getToolAvailability = (
  tool
) => {
  return (
    tool?.availability ||
    tool?.status ||
    "Available"
  );
};


const getToolOwnerName = (
  tool
) => {
  if (
    tool?.owner &&
    typeof tool.owner === "object"
  ) {
    const firstName =
      tool.owner.first_name ||
      tool.owner.firstName ||
      "";

    const lastName =
      tool.owner.last_name ||
      tool.owner.lastName ||
      "";

    return (
      tool.owner.name ||
      [firstName, lastName]
        .filter(Boolean)
        .join(" ") ||
      "Neighbour"
    );
  }

  return (
    tool?.ownerName ||
    tool?.owner_name ||
    tool?.owner ||
    ""
  );
};


const getToolLocation = (
  tool
) => {
  return (
    tool?.location ||
    tool?.owner?.location ||
    tool?.owner?.address ||
    ""
  );
};


const getToolIcon = (
  tool
) => {
  if (tool?.icon) {
    return tool.icon;
  }

  const name = String(
    tool?.name || ""
  ).toLowerCase();


  if (
    name.includes("hammer")
  ) {
    return "🔨";
  }


  if (
    name.includes("ladder")
  ) {
    return "🪜";
  }


  if (
    name.includes("drill")
  ) {
    return "🛠️";
  }


  if (
    name.includes("pressure washer") ||
    name.includes("washer")
  ) {
    return "💦";
  }


  if (
    name.includes("lawnmower") ||
    name.includes("lawn mower") ||
    name.includes("mower")
  ) {
    return "🌿";
  }


  if (
    name.includes("hedge") ||
    name.includes("trimmer")
  ) {
    return "✂️";
  }


  if (
    name.includes("circular saw") ||
    name.includes("saw")
  ) {
    return "⚙️";
  }


  if (
    name.includes("hand tool") ||
    name.includes("tool set")
  ) {
    return "🔧";
  }


  if (
    name.includes("vacuum")
  ) {
    return "🧹";
  }


  return "🔧";
};


function BrowseTools() {
  const [
    tools,
    setTools,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    cart,
    setCart,
  ] = useState([]);


  const [
    page,
    setPage,
  ] = useState(1);


  const [
    totalPages,
    setTotalPages,
  ] = useState(1);


  const navigate =
    useNavigate();


  const {
    currentUser,
  } = useAuth();


  useEffect(() => {
    let isMounted = true;


    const loadTools =
      async () => {
        try {
          setLoading(true);

          setError("");


          const data =
            await getTools({
              page,
              limit:
                ITEMS_PER_PAGE,
            });


          if (!isMounted) {
            return;
          }


          setTools(
            Array.isArray(
              data?.tools
            )
              ? data.tools
              : []
          );


          setTotalPages(
            Number(
              data?.totalPages
            ) || 1
          );
        } catch (error) {
          if (!isMounted) {
            return;
          }


          setError(
            error.message ||
              "Unable to load tools."
          );


          setTools([]);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };


    loadTools();


    return () => {
      isMounted = false;
    };
  }, [page]);


  function isInCart(
    toolId
  ) {
    return cart.some(
      (item) =>
        String(item.id) ===
        String(toolId)
    );
  }


  function handleAddToCart(
    tool
  ) {
    setCart(
      (currentCart) => {
        const alreadyAdded =
          currentCart.some(
            (item) =>
              String(
                item.id
              ) ===
              String(
                tool.id
              )
          );


        if (alreadyAdded) {
          return currentCart;
        }


        return [
          ...currentCart,
          tool,
        ];
      }
    );
  }


  function handleRequest(
    tool
  ) {
    if (!currentUser) {
      navigate(
        "/auth?mode=login",
        {
          state: {
            redirectTo:
              `/tools/${tool.id}`,
          },
        }
      );

      return;
    }


    navigate(
      `/tools/${tool.id}`
    );
  }


  function handlePreviousPage() {
    setPage(
      (currentPage) =>
        Math.max(
          1,
          currentPage - 1
        )
    );
  }


  function handleNextPage() {
    setPage(
      (currentPage) =>
        Math.min(
          totalPages,
          currentPage + 1
        )
    );
  }


  if (loading) {
    return (
      <section className="browse-tools">

        <p className="browse-tools__status">
          Loading tools...
        </p>

      </section>
    );
  }


  if (error) {
    return (
      <section className="browse-tools">

        <p className="browse-tools__status browse-tools__status--error">
          {error}
        </p>

      </section>
    );
  }


  return (
    <section className="browse-tools">

      <div className="browse-tools__header">

        <h2 className="browse-tools__heading">
          Browse tools
        </h2>


        {cart.length > 0 && (

          <div className="browse-tools__cart-badge">

            <ShoppingCart
              size={16}
            />

            {cart.length}{" "}
            {cart.length === 1
              ? "selected"
              : "selected"}

          </div>

        )}

      </div>


      {tools.length === 0 ? (

        <p className="browse-tools__status">
          No tools are currently
          available.
        </p>

      ) : (

        <div className="browse-tools__grid">

          {tools.map(
            (tool) => {
              const availability =
                getToolAvailability(
                  tool
                );


              const available =
                availability
                  .toLowerCase() ===
                "available";


              const inCart =
                isInCart(
                  tool.id
                );


              const owner =
                getToolOwnerName(
                  tool
                );


              const location =
                getToolLocation(
                  tool
                );


              const icon =
                getToolIcon(
                  tool
                );


              return (
                <div
                  className="tool-card"
                  key={tool.id}
                >

                  <div className="tool-card__icon-wrap">

                    {tool.image ? (
                      <img
                        className="tool-card__icon"
                        src={tool.image}
                        alt={tool.name || "Tool"}
                      />
                    ) : (
                      <span
                        className="tool-card__icon"
                        aria-hidden="true"
                      >
                        {icon}
                      </span>
                    )}


                    {!available && (

                      <span className="tool-card__badge">
                        {
                          availability
                        }
                      </span>

                    )}

                  </div>


                  <div className="tool-card__body">

                    <p className="tool-card__name">
                      {tool.name}
                    </p>


                    <p className="tool-card__condition">
                      {tool.condition ||
                        "Condition not specified"}
                    </p>


                    <div className="tool-card__meta">

                      {owner && (

                        <span className="tool-card__owner">

                          <User
                            size={13}
                          />

                          {owner}

                        </span>

                      )}


                      {location && (

                        <span className="tool-card__location">

                          <MapPin
                            size={13}
                          />

                          {location}

                        </span>

                      )}

                    </div>


                    <div className="tool-card__actions">

                      <button
                        type="button"
                        className="tool-card__btn tool-card__btn--request"
                        onClick={() =>
                          handleRequest(
                            tool
                          )
                        }
                        disabled={
                          !available
                        }
                      >
                        {available
                          ? "Request"
                          : "Unavailable"}
                      </button>


                      <button
                        type="button"
                        className="tool-card__btn tool-card__btn--cart"
                        onClick={() =>
                          handleAddToCart(
                            tool
                          )
                        }
                        disabled={
                          inCart ||
                          !available
                        }
                      >

                        {inCart ? (

                          <Check
                            size={14}
                          />

                        ) : (

                          <ShoppingCart
                            size={14}
                          />

                        )}


                        {inCart
                          ? "Added"
                          : "Add to Cart"}

                      </button>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

      )}


      {totalPages > 1 && (

        <div className="browse-tools__pagination">

          <button
            type="button"
            className="browse-tools__page-btn"
            onClick={
              handlePreviousPage
            }
            disabled={
              page === 1
            }
          >

            <ChevronLeft
              size={16}
            />

            Prev

          </button>


          <span className="browse-tools__page-label">

            Page {page} of{" "}
            {totalPages}

          </span>


          <button
            type="button"
            className="browse-tools__page-btn"
            onClick={
              handleNextPage
            }
            disabled={
              page >= totalPages
            }
          >

            Next

            <ChevronRight
              size={16}
            />

          </button>

        </div>

      )}

    </section>
  );
}


export default BrowseTools;
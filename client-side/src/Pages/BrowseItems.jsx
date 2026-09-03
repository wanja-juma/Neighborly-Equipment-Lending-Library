import {
  useMemo,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";
import useItems from "../hooks/useItems";
import useRequests from "../hooks/useRequests";

import "./BrowseItems.css";


const DEFAULT_CATEGORIES = [
  "Power Tools",
  "Hand Tools",
  "Gardening",
  "Cleaning Equipment",
  "Construction Equipment",
  "Outdoor Equipment",
  "Automotive",
  "Other",
];


const getLocalDate = () => {
  const today = new Date();

  const year =
    today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const getItemCategory = (item) => {
  if (
    item?.category &&
    typeof item.category === "object"
  ) {
    return (
      item.category.name ||
      item.category.title ||
      ""
    );
  }

  return (
    item?.category ||
    item?.category_name ||
    item?.categoryName ||
    item?.categoryId ||
    item?.category_id ||
    ""
  );
};


const getItemOwnerId = (item) => {
  return (
    item?.ownerId ??
    item?.owner_id ??
    item?.owner?.id ??
    ""
  );
};


const getItemOwnerName = (item) => {
  if (
    item?.owner &&
    typeof item.owner === "object"
  ) {
    const firstName =
      item.owner.first_name ||
      item.owner.firstName ||
      "";

    const lastName =
      item.owner.last_name ||
      item.owner.lastName ||
      "";

    return (
      item.owner.name ||
      [firstName, lastName]
        .filter(Boolean)
        .join(" ") ||
      "Neighbour"
    );
  }

  return (
    item?.ownerName ||
    item?.owner_name ||
    item?.owner ||
    "Neighbour"
  );
};


const getItemAvailability = (item) => {
  return (
    item?.availability ||
    item?.status ||
    "Available"
  );
};


const getItemIcon = (item) => {
  if (item?.icon) {
    return item.icon;
  }

  const name = String(
    item?.name || ""
  ).toLowerCase();

  const category = String(
    getItemCategory(item) || ""
  ).toLowerCase();

  if (name.includes("ladder")) {
    return "🪜";
  }

  if (name.includes("hammer")) {
    return "🔨";
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

  if (name.includes("drill")) {
    return "🛠️";
  }

  if (
    name.includes("circular saw") ||
    name.includes("saw")
  ) {
    return "⚙️";
  }

  if (
    name.includes("hand tool") ||
    name.includes("tool set") ||
    category.includes("hand tool")
  ) {
    return "🔧";
  }

  if (
    name.includes("vacuum") ||
    category.includes("clean")
  ) {
    return "🧹";
  }

  if (name.includes("wheelbarrow")) {
    return "🛒";
  }

  if (category.includes("gardening")) {
    return "🌱";
  }

  if (category.includes("power")) {
    return "🛠️";
  }

  if (category.includes("outdoor")) {
    return "🏡";
  }

  return "🔧";
};


function BrowseItems() {
  const { currentUser } = useAuth();

  const currentUserId = String(
    currentUser?.id || ""
  );

  const {
    currentUser,
  } = useAuth();

  const {
    items,
    itemsLoading,
    itemsError,
  } = useItems();

  const {
    addBorrowingRequest,
  } = useRequests();


  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(
    "All Categories"
  );

  const [
    selectedAvailability,
    setSelectedAvailability,
  ] = useState(
    "Available"
  );

  const [
    notice,
    setNotice,
  ] = useState("");


  const [formError, setFormError] =
    useState("");

  const minimumDate = getLocalDate();

  const safeItems = Array.isArray(items)
    ? items
    : [];

  // Do not show the current user's items
  // on the community browsing page.
  const communityItems = useMemo(
    () =>
      safeItems.filter(
        (item) =>
          String(getItemOwnerId(item)) !==
          currentUserId
      ),
    [safeItems, currentUserId]
  );
  const [
    selectedItem,
    setSelectedItem,
  ] = useState(null);

  const [
    borrowDates,
    setBorrowDates,
  ] = useState({
    startDate: "",
    endDate: "",
  });

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    submittingRequest,
    setSubmittingRequest,
  ] = useState(false);


  const minimumDate =
    getLocalDate();

  const currentUserId =
    currentUser?.id !==
      undefined &&
    currentUser?.id !== null
      ? String(currentUser.id)
      : "";


  const safeItems =
    Array.isArray(items)
      ? items
      : Array.isArray(
          items?.items
        )
        ? items.items
        : [];


  /*
   * Do not show items belonging
   * to the currently logged-in user.
   */
  const communityItems =
    useMemo(
      () =>
        safeItems.filter(
          (item) => {
            const ownerId =
              getItemOwnerId(
                item
              );

            if (!currentUserId) {
              return true;
            }

            return (
              String(ownerId) !==
              currentUserId
            );
          }
        ),
      [
        safeItems,
        currentUserId,
      ]
    );


  /*
   * Build categories using both
   * predefined categories and
   * categories returned from Flask.
   */
  const categories =
    useMemo(() => {
      const itemCategories =
        communityItems
          .map((item) =>
            String(
              getItemCategory(
                item
              ) || ""
            ).trim()
          )
          .filter(Boolean);

      return [
        "All Categories",

        ...new Set([
          ...DEFAULT_CATEGORIES,
          ...itemCategories,
        ]),
      ];
    }, [communityItems]);


  /*
   * Filter community items.
   */
  const filteredItems =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      const normalizedCategory =
        selectedCategory
          .toLowerCase();

      const normalizedAvailability =
        selectedAvailability
          .toLowerCase();

      return communityItems.filter(
        (item) => {
          const itemName =
            String(
              item?.name || ""
            ).toLowerCase();

          const itemDescription =
            String(
              item?.description ||
                ""
            ).toLowerCase();

          const itemOwner =
            String(
              getItemOwnerName(
                item
              ) || ""
            ).toLowerCase();

          const itemCategory =
            String(
              getItemCategory(
                item
              ) || ""
            ).toLowerCase();

          const itemAvailability =
            String(
              getItemAvailability(
                item
              ) || ""
            ).toLowerCase();


          const matchesSearch =
            !normalizedSearch ||
            itemName.includes(
              normalizedSearch
            ) ||
            itemDescription.includes(
              normalizedSearch
            ) ||
            itemOwner.includes(
              normalizedSearch
            );


          const matchesCategory =
            selectedCategory ===
              "All Categories" ||
            itemCategory ===
              normalizedCategory;


          const matchesAvailability =
            selectedAvailability ===
              "All Statuses" ||
            itemAvailability ===
              normalizedAvailability;


          return (
            matchesSearch &&
            matchesCategory &&
            matchesAvailability
          );
        }
      );
    }, [
      communityItems,
      searchTerm,
      selectedCategory,
      selectedAvailability,
    ]);


  const openBorrowForm = (item) => {
    const availability =
      String(
        getItemAvailability(
          item
        ) || ""
      ).toLowerCase();

    if (
      availability !==
      "available"
    ) {
      setNotice(
        "This item is currently unavailable."
      );

      return;
    }

    setSelectedItem(item);

    setBorrowDates({
      startDate: "",
      endDate: "",
    });

    setFormError("");
    setNotice("");
  };


  const closeBorrowForm = () => {
    if (submittingRequest) {
      return;
    }

    setSelectedItem(null);

    setBorrowDates({
      startDate: "",
      endDate: "",
    });

    setFormError("");
  };


  const handleDateChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setBorrowDates(
      (currentDates) => ({
        ...currentDates,
        [name]: value,
      })
    );

    setFormError("");
  };


  const handleBorrowRequest =
    async (event) => {
      event.preventDefault();

      if (!selectedItem) {
        return;
      }


    try {
      const result =
        await addBorrowingRequest({
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          itemIcon:
            selectedItem.icon ||
            "🧰",
          ownerId:
            getItemOwnerId(
              selectedItem
            ),
          ownerName:
            getItemOwnerName(
              selectedItem
            ),
          borrowerId:
            currentUserId,
          borrowerName:
            currentUser?.name ||
            "Neighbour",
          startDate:
            borrowDates.startDate,
          endDate:
            borrowDates.endDate,
        });
      if (!currentUserId) {
        setFormError(
          "You must be logged in to request an item."
        );

        return;
      }


      const availability =
        String(
          getItemAvailability(
            selectedItem
          ) || ""
        ).toLowerCase();

      if (
        availability !==
        "available"
      ) {
        setFormError(
          "This item is no longer available to borrow."
        );

        return;
      }


      const ownerId =
        getItemOwnerId(
          selectedItem
        );

      if (
        ownerId !==
          undefined &&
        ownerId !== null &&
        String(ownerId) ===
          currentUserId
      ) {
        setFormError(
          "You cannot request your own item."
        );

        return;
      }


      if (
        !borrowDates.startDate ||
        !borrowDates.endDate
      ) {
        setFormError(
          "Please select both the borrowing and return dates."
        );

        return;
      }


      if (
        borrowDates.startDate <
        minimumDate
      ) {
        setFormError(
          "The borrowing date cannot be in the past."
        );

        return;
      }


      if (
        borrowDates.endDate <
        borrowDates.startDate
      ) {
        setFormError(
          "The return date must be after the borrowing date."
        );

        return;
      }


      const itemId =
        Number(
          selectedItem.id
        );

      if (
        !Number.isInteger(itemId) ||
        itemId <= 0
      ) {
        setFormError(
          "This item has an invalid ID."
        );

        return;
      }


      try {
        setSubmittingRequest(true);
        setFormError("");


        /*
         * IMPORTANT:
         *
         * Send the field names expected
         * by the Flask borrowing-request
         * API.
         *
         * Do not send borrower_id.
         * Flask should get the borrower
         * from the JWT identity.
         */
        const result =
  await addBorrowingRequest({
    equipment_id: itemId,
    start_date:
      borrowDates.startDate,
    end_date:
      borrowDates.endDate,
  });


        setNotice(
          result?.message ||
            "Borrowing request submitted successfully."
        );


        setSelectedItem(
          null
        );

        setBorrowDates({
          startDate: "",
          endDate: "",
        });

        setFormError("");
      } catch (error) {
        console.error(
          "Borrowing request failed:",
          error
        );

        setFormError(
          error?.message ||
            "Unable to submit the borrowing request."
        );
      } finally {
        setSubmittingRequest(
          false
        );
      }
    };


  const clearFilters = () => {
    setSearchTerm("");

    setSelectedCategory(
      "All Categories"
    );

    setSelectedAvailability(
      "Available"
    );
  };


  if (itemsLoading) {
    return (
      <main className="dashboard-main">
        <section className="items-page">
          <p>
            Loading available items...
          </p>
        </section>
      </main>
    );
  }


  if (itemsError) {
    return (
      <main className="dashboard-main">
        <section className="items-page">
          <p>
            {itemsError}
          </p>
        </section>
      </main>
    );
  }


  return (
    <main className="dashboard-main">
      <section className="items-page">
        {notice && (
          <div
            className="browse-notice"
            role="status"
          >
            <span>
              {notice}
            </span>

            <button
              type="button"
              onClick={() =>
                setNotice("")
              }
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}


        <header className="items-page-header">
          <div>
            <p className="page-label">
              COMMUNITY EQUIPMENT
            </p>

            <h1>
              Browse Items
            </h1>

            <p>
              Find tools and
              equipment available
              from neighbours in
              your community.
            </p>
          </div>
        </header>


        <section
          className="browse-filters"
          aria-label="Item filters"
        >
          <label className="browse-search">
            <span>
              ⌕
            </span>

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search items"
              aria-label="Search community items"
            />
          </label>


          <label className="filter-field">
            <span>
              Category
            </span>

            <select
              value={
                selectedCategory
              }
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
            >
              {categories.map(
                (category) => (
                  <option
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {category}
                  </option>
                )
              )}
            </select>
          </label>


          <label className="filter-field">
            <span>
              Availability
            </span>

            <select
              value={
                selectedAvailability
              }
              onChange={(event) =>
                setSelectedAvailability(
                  event.target.value
                )
              }
            >
              <option value="Available">
                Available
              </option>

              <option value="All Statuses">
                All Statuses
              </option>

              <option value="Requested">
                Requested
              </option>

              <option value="On Loan">
                On Loan
              </option>
            </select>
          </label>


          <button
            className="clear-filters-button"
            type="button"
            onClick={
              clearFilters
            }
          >
            Clear Filters
          </button>
        </section>


        <div className="browse-results-heading">
          <p>
            <strong>
              {filteredItems.length}
            </strong>{" "}

            {filteredItems.length ===
            1
              ? "item found"
              : "items found"}
          </p>
        </div>


        {filteredItems.length >
        0 ? (
          <div className="items-page-grid">
            {filteredItems.map((item) => {
              const category =
                getItemCategory(item) ||
                "Other";

              const owner =
                getItemOwnerName(item);

              const availability =
                getItemAvailability(item);

              const isAvailable =
                availability.toLowerCase() ===
                "available";

              const statusClass =
                item.statusColor ||
                availability
                  .toLowerCase()
                  .replaceAll(" ", "-");

              return (
                <article
                  className="equipment-card"
                  key={item.id}
                >
                  <div className="equipment-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name || "Item"}
                      />
                    ) : (
                      <span>
                        {item.icon || "🧰"}
                      </span>
                    )}

                    <span
                      className={`image-status ${statusClass}`}
                    >
                      {availability}
                    </span>
                  </div>

                  <div className="equipment-content">
                    <div className="equipment-heading">
                      <span className="equipment-category">
                        {category}
                      </span>
                    </div>

            {filteredItems.map(
              (item) => {
                const category =
                  getItemCategory(
                    item
                  ) ||
                  "Other";

                const owner =
                  getItemOwnerName(
                    item
                  );

                const availability =
                  getItemAvailability(
                    item
                  );

                const itemIcon =
                  getItemIcon(
                    item
                  );

                const isAvailable =
                  String(
                    availability
                  ).toLowerCase() ===
                  "available";

                const statusClass =
                  item.statusColor ||
                  String(
                    availability
                  )
                    .toLowerCase()
                    .replaceAll(
                      " ",
                      "-"
                    );


                return (
                  <article
                    className="equipment-card"
                    key={item.id}
                  >
                    <div className="equipment-image">
                      <span>
                        {itemIcon}
                      </span>

                      <span
                        className={`image-status ${statusClass}`}
                      >
                        {availability}
                      </span>
                    </div>


                    <div className="equipment-content">
                      <div className="equipment-heading">
                        <span className="equipment-category">
                          {category}
                        </span>
                      </div>


                      <h2>
                        {item.name}
                      </h2>


                      <p className="equipment-description">
                        {item.description ||
                          "No description available."}
                      </p>


                      <div className="equipment-details">
                        <span>
                          <b>
                            Condition:
                          </b>{" "}
                          {item.condition ||
                            "Not specified"}
                        </span>

                        <span>
                          <b>
                            Owner:
                          </b>{" "}
                          {owner}
                        </span>

                        <span>
                          <b>
                            Location:
                          </b>{" "}
                          {item.location ||
                            "Not specified"}
                        </span>
                      </div>


                      <button
                        className="borrow-item-button"
                        type="button"
                        disabled={
                          !isAvailable
                        }
                        onClick={() =>
                          openBorrowForm(
                            item
                          )
                        }
                      >
                        {isAvailable
                          ? "Request to Borrow"
                          : "Currently Unavailable"}
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        ) : (
          <div className="items-empty-state">
            <span>
              🔍
            </span>

            <h2>
              No matching items found
            </h2>

            <p>
              Try changing your
              search term, category
              or availability filter.
            </p>

            <button
              className="empty-clear-button"
              type="button"
              onClick={
                clearFilters
              }
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>


      {selectedItem && (
        <div className="borrow-modal-overlay">
          <section
            className="borrow-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="borrow-modal-title"
          >
            <header className="borrow-modal-header">
              <div>
                <p className="page-label">
                  BORROWING REQUEST
                </p>

                <h2 id="borrow-modal-title">
                  Request{" "}
                  {
                    selectedItem.name
                  }
                </h2>

                <p>
                  Select the dates
                  you would like to
                  borrow this item.
                </p>
              </div>


              <button
                className="close-modal-button"
                type="button"
                onClick={
                  closeBorrowForm
                }
                aria-label="Close borrowing form"
                disabled={
                  submittingRequest
                }
              >
                ×
              </button>
            </header>


            <div className="borrow-item-summary">
              {selectedItem.image ? (
                <img
                  className="borrow-summary-icon"
                  src={selectedItem.image}
                  alt={selectedItem.name || "Item"}
                />
              ) : (
                <span className="borrow-summary-icon">
                  {selectedItem.icon ||
                    "🧰"}
                </span>
              )}

              <span className="borrow-summary-icon">
                {
                  getItemIcon(
                    selectedItem
                  )
                }
              </span>

              <div>
                <strong>
                  {
                    selectedItem.name
                  }
                </strong>

                <span>
                  Owned by{" "}
                  {
                    getItemOwnerName(
                      selectedItem
                    )
                  }
                </span>

                <small>
                  {selectedItem.condition ||
                    "Condition not specified"}
                </small>
              </div>
            </div>


            <form
              className="borrow-date-form"
              onSubmit={
                handleBorrowRequest
              }
            >
              <div className="borrow-date-fields">
                <label className="item-form-field">
                  <span>
                    Borrowing Date{" "}
                    <b>
                      *
                    </b>
                  </span>

                  <input
                    type="date"
                    name="startDate"
                    value={
                      borrowDates.startDate
                    }
                    min={
                      minimumDate
                    }
                    onChange={
                      handleDateChange
                    }
                    disabled={
                      submittingRequest
                    }
                    required
                  />
                </label>


                <label className="item-form-field">
                  <span>
                    Return Date{" "}
                    <b>
                      *
                    </b>
                  </span>

                  <input
                    type="date"
                    name="endDate"
                    value={
                      borrowDates.endDate
                    }
                    min={
                      borrowDates.startDate ||
                      minimumDate
                    }
                    onChange={
                      handleDateChange
                    }
                    disabled={
                      submittingRequest
                    }
                    required
                  />
                </label>
              </div>


              {formError && (
                <div
                  className="borrow-form-error"
                  role="alert"
                >
                  {formError}
                </div>
              )}


              <div className="borrow-request-information">
                <strong>
                  Before submitting
                </strong>

                <ul>
                  <li>
                    Wait for the item
                    owner to approve
                    your request.
                  </li>

                  <li>
                    Collect the item
                    only after the
                    request is
                    approved.
                  </li>

                  <li>
                    Return the item
                    by the selected
                    return date.
                  </li>
                </ul>
              </div>


              <div className="borrow-modal-actions">
                <button
                  className="cancel-request-button"
                  type="button"
                  onClick={
                    closeBorrowForm
                  }
                  disabled={
                    submittingRequest
                  }
                >
                  Cancel
                </button>


                <button
                  className="submit-request-button"
                  type="submit"
                  disabled={
                    submittingRequest
                  }
                >
                  {submittingRequest
                    ? "Submitting..."
                    : "Submit Request"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}


export default BrowseItems;
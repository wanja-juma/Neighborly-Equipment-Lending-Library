# Neighborly — Equipment Lending Library

**Neighborly** is a full-stack community platform that allows neighbours to lend and borrow tools and equipment. Members can list equipment, browse available items, send borrowing requests, manage loans, and track their listings.

---

## Project Status

> **Status:** Under active development

The current version includes the main React interface, authentication integration, user profiles, equipment listings, request management, loan summaries, and the initial Flask API.

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected frontend and backend routes
- Logged-in user information displayed on the dashboard
- Client-side logout
- Secure password hashing

### User Profiles

- User and Profile database models
- One-to-one User–Profile relationship
- Profile information displayed with user data
- Profile update functionality
- Dynamic user name and initials on the dashboard

### Equipment

- Browse available tools and equipment
- Search and filter equipment
- Add new equipment
- View personal listings
- Edit a listing
- Delete a listing
- Change equipment availability
- Display item condition and location

### Borrowing Requests

- Send borrowing requests
- Select a borrowing date range
- Separate Incoming and Outgoing request tabs
- Display only one request category at a time
- Approve incoming requests
- Decline incoming requests
- Display request statuses

### Dashboard

- Dynamic welcome message
- My Listings summary
- Pending Requests summary
- Items Borrowed summary
- Items Lent Out summary
- Recent equipment listings
- Active loan information
- Return reminders

---

## User Stories

As a user, I can:

1. **Register and log in** to my account.
2. **View and update my profile.**
3. **List a tool or piece of equipment.**
4. **Browse equipment** shared by neighbours.
5. **Check the availability** of an item.
6. **Request to borrow an item** for a selected date range.
7. **Approve or decline** incoming borrowing requests.
8. **View outgoing requests** I have submitted.
9. **View active loans** as a borrower or owner.
10. **Change the availability** of my equipment.
11. **Edit or delete** my listings.

---

## Technology Stack

### Frontend

- **React**
- **Vite**
- **React Router**
- **JavaScript**
- **CSS**

### Backend

- **Python**
- **Flask**
- **Flask-SQLAlchemy**
- **Flask-Migrate**
- **Flask-JWT-Extended**
- **Flask-Marshmallow**
- **Marshmallow-SQLAlchemy**
- **Flask-CORS**
- **SQLite**

---

## Project Structure

```text
Neighborly-Equipment-Lending-Library/
├── client-side/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── extensions.py
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── migrations/
│   ├── instance/
│   ├── tests/
│   ├── run.py
│   └── requirements.txt
│
└── README.md
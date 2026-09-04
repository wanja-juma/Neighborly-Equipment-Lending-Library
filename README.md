# 🛠️ Neighborly — Equipment Lending Library
Neighborly is a community-based tool and equipment lending platform that allows neighbours to lend and borrow tools such as drills, ladders, lawnmowers, pressure washers, and other equipment.

Share tools. Save money. Build community.

 ## Table of Contents
 About the Project

 Problem Statement

 Solution

 Key Features

 User Flow

 Technologies Used

 Project Structure

 ### Installation and Setup

▶ Running the Application

 API Overview

 Authentication

 Database Management

 Production Build

 Future Improvements

 Project Vision

 Contributors

 License

## About the Project
Neighborly is a full-stack web application designed to make borrowing and lending tools within a community easier, more organized, and more accountable.

Instead of purchasing equipment that may only be needed occasionally, users can borrow available equipment from other members of their community.

Equipment owners can list their tools, manage borrowing requests, track active loans, and confirm when borrowed equipment has been returned.

Neighborly makes community equipment sharing easier, more affordable, and more organized.

## Problem Statement
Many people occasionally need tools and equipment such as drills, ladders, lawnmowers, or pressure washers, but purchasing these items for infrequent use can be expensive and wasteful.

At the same time, many households own tools that remain unused for long periods.

Existing informal lending methods, such as WhatsApp groups, word of mouth, or borrowing directly from friends and neighbours, often lack a structured way to:

Discover available items

Manage borrowing requests

Track active loans

Handle payments

Monitor item availability

Report damaged equipment

Ensure borrowed items are returned responsibly

##  Solution
Neighborly provides a centralized platform where community members can list equipment they are willing to lend and allow other users to request those items for specific dates.

The system manages the complete borrowing process from discovering an item to returning it.

The platform provides a more:

Affordable way to access equipment

Organized borrowing and lending process

Convenient way to discover tools

Accountable system for managing loans

Community-driven approach to sharing resources

## Key Features

Users can:

Register an account

Log in securely

Access protected pages

View their profile

Update their account information

Log out

Authentication is handled using JSON Web Tokens (JWT).

### Browse Equipment
Users can browse equipment listed by other members of the community.

Equipment information can include:

Item name

Category

Description

Condition

Owner

Availability

Location

### Equipment Listings
Equipment owners can:

Add new equipment

View their listings

Edit existing listings

Delete listings

Change equipment availability

Equipment availability helps users know whether an item can currently be borrowed.

### Cart
Users can add equipment they are interested in borrowing to their cart.

The cart allows users to:

Review selected equipment

Remove equipment

Submit borrowing requests

Cart information is stored locally so selected items can remain available between page refreshes.

### Borrowing Requests
Borrowers can select:

Borrowing date

Return date

They can then submit a borrowing request to the equipment owner.

Equipment owners can:

Approve requests

Decline requests

Users can view both their incoming and outgoing requests.

### Payments
Payments are connected to approved borrowing requests.

A borrower cannot make a payment for an item before the borrowing request has been approved.

Borrowing Request → Owner Approval → Payment → Active Loan

Borrowing Request
        ↓
Owner Approval
        ↓
Payment
        ↓
Active Loan
### Loan Management
Approved borrowing transactions can be tracked through the Loans section.

Users can view information about:

Borrowed equipment

Equipment owner

Borrower

Borrowing dates

Return dates

Loan status

### Item Returns
When a borrowing request is approved, the system creates an active loan and marks the item as unavailable.

After the borrower returns the item, the owner confirms the return.

The loan is then marked as returned and the equipment becomes available again.

Request Item
     ↓
Owner Approves
     ↓
Loan Created
     ↓
Item Unavailable
     ↓
Borrower Returns Item
     ↓
Owner Confirms Return
     ↓
Loan Marked Returned
     ↓
Item Available Again

### Damage Reports
The platform provides a damage reporting system for equipment associated with loans.

Damage reports can include:

Loan

Damage severity

Damage description

Report status

Damage reports can then be reviewed and resolved.

### User Profile
Users can manage their profile information from within the application.

Profile functionality includes:

Viewing profile information

Updating account information

Managing account details

### User Flow
Register or log in to Neighborly.

An equipment owner lists an item.

Another user browses available equipment.

The borrower adds an item to the cart.

The borrower selects borrowing and return dates.

A borrowing request is submitted.

The equipment owner reviews the request.

The owner approves or declines the request.

After approval, the borrower can proceed with payment.

The loan becomes active.

The item becomes unavailable while borrowed.

The borrower returns the equipment.

The owner confirms the return.

The loan is marked as returned.

The item becomes available again.

### Technologies Used
#### Frontend
React

React Router

Vite

JavaScript

CSS

Lucide React

ESLint

#### Backend
Python

Flask

Flask-RESTful

Flask-SQLAlchemy

Flask-Migrate

Flask-JWT-Extended

Flask-CORS

Marshmallow

#### Database
SQLite — Development

PostgreSQL — Intended production database

#### Development Tools
Git

GitHub

VS Code

WSL / Ubuntu

npm

pip

#### Project Structure
Neighborly-Equipment-Lending-Library/
│
├── client-side/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── Pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── app/
│   ├── migrations/
│   ├── instance/
│   ├── run.py
│   └── requirements.txt
│
├── .gitignore
└── README.md

### Installation and Setup
#### Clone the Repository
git clone <repository-url>
Move into the project directory:

cd Neighborly-Equipment-Lending-Library
#### Backend Setup
Navigate to the backend:

cd server
Create a virtual environment:

python3 -m venv .venv
Activate the virtual environment:

source .venv/bin/activate
Install the Python dependencies:

pip install -r requirements.txt
Apply existing database migrations:

flask db upgrade
Start the Flask backend:

python run.py
The backend runs locally at:

http://localhost:5555

#### Frontend Setup
Open another terminal and navigate to the frontend:

cd client-side
Install the frontend dependencies:

npm install
Start the Vite development server:

npm run dev
The frontend will typically be available at:

http://localhost:5173

▶️ Running the Application
During development, run the backend and frontend in separate terminals.

### Terminal 1 — Backend
cd server
source .venv/bin/activate
python run.py
#### Terminal 2 — Frontend
cd client-side
npm run dev
Then open the frontend application in your browser.

### API Overview
The React frontend communicates with the Flask REST API.

Some of the application's API resources include:

/api/auth
/api/items
/api/borrowing-requests
/api/loans
/api/payments
/api/damage-reports
/api/profiles
Note: The exact supported HTTP methods depend on each API resource.

### Authentication
Neighborly uses JWT authentication.

After a successful login, the frontend stores the authentication token and includes it when accessing protected backend resources.

Protected requests use an authorization header in the following format:

Authorization: Bearer <token>
The backend uses the authenticated user to determine which resources the user can access, create, update, or delete.

#### Database Management
Neighborly uses SQLAlchemy for database management and Flask-Migrate/Alembic for database migrations.

Apply Existing Migrations
flask db upgrade
Create a New Migration
When model changes require a new migration:

flask db migrate -m "describe migration"
Apply the New Migration
flask db upgrade

 #### Production Build
Before deployment, test the React production build.

Navigate to the frontend:

cd client-side
Run:

npm run build
A successful build should complete without compilation errors.

## Future Improvements 

### Mobile Application
A dedicated mobile application could make it easier for community members to browse, request, and manage equipment from their phones.

### E-commerce
Neighborly could expand beyond lending by allowing users to buy and sell tools and equipment.

### Community Forums
Community forums could allow neighbours to:

Share equipment advice

Discuss projects

Recommend tools

Help other community members

Share experiences

#### Supplier Partnerships
Neighborly could partner with equipment suppliers and hardware businesses to provide users with:

Additional equipment

Discounts

Professional tools

Supplier offers

#### Project Vision
Neighborly aims to encourage better use of existing community resources by making equipment sharing easier and more organized.

Instead of every household purchasing equipment that may rarely be used, communities can share resources, reduce costs, and make better use of existing tools.

##### Contributors
This project was developed collaboratively as a full-stack software development project.

Contributor	Role
Team Member 1	Full-Stack Developer
Team Member 2	Full-Stack Developer
Team Member 3	Full-Stack Developer
Team Member 4	Full-Stack Developer
#### License
This project was created for educational and portfolio purposes.

#### Neighborly
Share tools. Save money. Build community.
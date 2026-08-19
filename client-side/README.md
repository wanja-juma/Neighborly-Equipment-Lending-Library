# Neighborly

Neighborly is a web-based community tool and equipment lending platform designed for residents of a street, estate, or local community. It provides a structured and reliable way for neighbors to share equipment instead of purchasing items they only need occasionally.

## Introduction

Most households own tools and equipment (drills, ladders, lawnmowers, pressure washers) that get used only a handful of times a year, yet sit in storage the rest of the time. Buying one's own equipment is often the default anyway, because there's no easy way to know what a neighbor already owns or whether it's available to borrow. Where informal lending does happen, it's usually through scattered WhatsApp groups or word of mouth, with no record of who has what, no visibility into condition or availability, and no accountability if something is returned late or damaged. This creates unnecessary spending for residents and avoidable friction between neighbors.

## Problem

1. **Wasteful, Repetitive Purchases**
   Households repeatedly buy equipment they'll use only a few times, when a shared item nearby would do.
2. **No Visibility Into What's Available Nearby**
   Residents have no central place to see what tools exist in their street or estate, or whether they're free to borrow.
3. **No Structured Way to Track Loans**
   Borrowing happens informally, so items get lost, forgotten, or returned late, with no record of the agreement.
4. **No Trust or Accountability Mechanism**
   Owners have no way to screen borrowers, log an item's condition before/after a loan, or resolve disputes over damage.

## Proposed Solution

A web-based community tool-lending platform built with Next.js (frontend) and Flask with PostgreSQL (backend) will give a street, estate, or community a structured, trustworthy way to share equipment. The system will allow residents to:

- Browse available items nearby, with photos, condition notes, and an availability calendar.
- Request to borrow an item for a specific date range.
- Have the owner approve or decline requests, with loan status tracked automatically (borrowed / returned / overdue).
- Receive automatic reminders when a borrowed item is due back.
- Log a simple deposit or damage report to protect the owner if an item comes back damaged.

This turns informal, easily forgotten favors into a system both sides can trust, and gives item owners a simple dashboard instead of a messy group chat.

## MVP Features (3-Week Timeline)

- Authentication (user registration and login)
- Item Listing Page (owners list tools with photos, condition notes, and availability)
- Borrow Request and Booking System (request a date range; owner approves or declines)
- Owner/Admin Dashboard (manage listings, requests, loan status, and overdue tracking)

## Technical Requirements

### Frontend (Next.js)
- Next.js (App Router): for SSR and routing
- NextAuth.js: authentication and session management
- Tailwind CSS: styling
- React date-picker / calendar library: availability calendar
- Axios: API communication (optional)

### Backend (Flask & PostgreSQL)
- PostgreSQL (relational database)
- REST API with Flask
- APScheduler / Celery: scheduled job for overdue-loan reminders (the backend scheduling logic feature)
- SendGrid / Twilio / Firebase: notifications (optional)

### Deployment & Hosting
- Frontend: Vercel
- Backend: Railway / Render
- Database: Supabase / Railway

## Technical Objectives

- All commits must be descriptive
- Before a commit is accepted, it must be reviewed by 2 members and the project lead
- Each feature must have its own branch
- The code should be modular, so that if one module fails it does not affect unrelated modules

## Project Status

This is a school project currently in the planning/early development stage.

## Team / Collaborators

Group composition: 6 web developers

- Ruth Juma
- Rhun Akulloh
- Henry Muchiri
- Izary Alugo Ochieng
- Mark Wainaina
- Jabari Ngure

## Getting Started

(Add setup/installation instructions once the codebase is initialized, e.g. cloning the repo, installing dependencies, running the dev server)

```bash
# Clone the repository
git clone https://github.com/wanja-juma/Neighborly-Equipment-Lending-Library.git .

# Install dependencies
# npm install / pip install -r requirements.txt (update as applicable)

# Run the app
# npm start / python manage.py runserver (update as applicable)
```

## Contributing

This project is being built collaboratively as part of a school assignment. Team members should branch off `main`, open pull requests for review, and keep commits descriptive. Every commit must be reviewed by 2 members and the project lead before it's accepted.

## License

No license has been added yet.
ComuniCal

> **Web and mobile platform for broadcasting, mapping, and managing local community events.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Google Maps API](https://img.shields.io/badge/Google%20Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)](#)

---

## :pushpin: Table of Contents
- [About the Project](#-about-the-project)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Folder Structure](#-architecture--folder-structure)
- [Data Models](#-data-models)
- [Personas & Usage Scenarios](#-personas--usage-scenarios)
- [Getting Started](#-getting-started)
- [Team & Credits](#-team--credits)
- [Links & Repository](#-links--repository)

---

## :dart: About the Project

**ComuniCal** is a responsive web application designed to simplify the discovery, scheduling, and management of local events. The platform serves as a bridge between the local population and community organizers (NGOs, cultural groups, sports associations), encouraging social engagement and community participation without relying on paid promotional campaigns.

This project was developed for the **Integrated Project (PI): Web Systems Development** course.

---

## :rocket: Objectives

* **Facilitate Event Discovery:** Help citizens quickly find cultural, sports, and educational activities nearby.
* **Simplify Event Registration:** Provide a user-friendly interface for organizers to register and manage events.
* **Integrated Navigation:** Seamless integration with map services to view venues and calculate routes.
* **Accessibility & Usability:** Responsive *Mobile-First* design offering an intuitive interface across all devices.

---

## :sparkles: Key Features

* **:calendar: Calendar View:** Interactive monthly calendar highlighting days with scheduled events.
* **:mag: Filtering & Search:** Search events by keywords or filter by categories (Cultural, Sports, Educational, Free).
* **:clipboard: Event List & Details:** Clear layout displaying title, description, time, venue, and responsible organization.
* **:map: Interactive Mapping:** Google Maps integration featuring markers, info windows, and real-time GPS navigation.
* **:pencil: Event Registration Form:** Allows organizers to register events, upload event cover images, and attach verification documents.
* **:first_quarter_moon: Dark Mode:** Theme toggling capability saved directly to user preferences.

---

## :tools: Tech Stack

### Frontend
* **HTML5:** Semantic layout and ARIA accessibility tags.
* **CSS3:** Modern, responsive styling powered by Flexbox, CSS Grid, and a *Mobile-First* approach.
* **JavaScript (ES6+):** Pure Vanilla JS using event-driven logic and native classes (`Calendar`, `TaskManager`).

### Maps & Geolocation
* **Google Maps JavaScript API:** Rendering maps, dynamic markers, and user geolocation.
* **Places Library:** Address autocomplete support in forms.

### Data Storage & State
* **Browser LocalStorage:** Client-side storage simulating authentication tokens, user state, and event/task datasets.

---

## :file_folder: Architecture & Folder Structure

The application operates as a static **Multi-Page Application (MPA)** with direct client-side navigation:

```text
comunical/
├── login/          # Login and user authentication screens
├── calendario/     # Interactive monthly calendar module
├── eventos/        # Event listing and filtering views
├── tasks/          # Task and agenda management
├── maps/           # Google Maps integration module
├── css/            # Shared styles (e.g., sidebar.css)
└── js/             # Core scripts (e.g., auth.js)

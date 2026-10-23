# NexCart

**A full-stack e-commerce application built with React and Spring Boot.**

[**Visit the live website →**](https://www.nexcart.cyou)

NexCart brings customer shopping, seller workflows, and administration into one web application, with product discovery, cart and wishlist features, checkout, and order management.

## Features

- Browse products, categories, search results, and product details
- Add products to a cart or wishlist
- Register, log in, reset passwords, and manage profile details and delivery addresses
- Complete checkout with Stripe and view order history
- Submit seller applications and access seller functionality
- Use admin tools for product, category, customer, seller, and order management

## Tech Stack

- **Frontend:** React, Vite, JavaScript, Redux, React Router, Tailwind CSS
- **Backend:** Java, Spring Boot, Spring Security, JWT, Spring Data JPA / Hibernate
- **Database:** PostgreSQL
- **Payments:** Stripe
- **Deployment:** Vercel, Render, Neon

## Architecture

```text
React frontend
     ↓ REST API
Spring Boot backend
     ↓ JPA / Hibernate
PostgreSQL database
```

## Run Locally

### Frontend

```bash
cd nexcart-web
npm install
npm run dev
```

### Backend

Open `nexcart-api` in IntelliJ IDEA and run the Spring Boot application. Configure the required database and application settings for your local environment before starting it.

## Project Structure

```text
NexCart-Commerce/
├── nexcart-web/   # React frontend
└── nexcart-api/   # Spring Boot REST API
```

## Security

Keep passwords, database credentials, API secret keys, and environment files out of source control. Use your own local development configuration when running the application.

---

Built as a full-stack portfolio project to demonstrate frontend development, REST API design, authentication, database integration, and e-commerce workflows.
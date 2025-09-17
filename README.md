# Shopify Insights Dashboard

This project is a multi-tenant data ingestion service and analytics dashboard for Shopify stores. It connects to the Shopify Admin API to ingest customer, product, and order data, storing it in a PostgreSQL database. The data is then visualized on a secure dashboard, providing store owners with key business insights.

---

## Features

-   **Shopify Data Ingestion:** A service that ingests and syncs customers, orders, and products via Shopify webhooks and a scheduled job.
-   **Multi-Tenancy:** Data isolation for multiple Shopify stores, ensuring each store's data is kept separate and secure.
-   **Secure Authentication:** A dashboard secured with email-based authentication.
-   **Key Metrics:** Dashboard displays total customers, orders, and revenue.
-   **Data Visualization:** Trend charts for orders by date with a date range filter.
-   **Top Customers:** A list of the top 5 customers by total spend.
-   **Automated Sync:** Uses webhooks to keep data in sync in near real-time.

---

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Frontend:** React.js
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Charting:** Recharts
-   **Deployment:** Heroku

---

## High-Level Architecture

The application is split into two main components: a backend service and a frontend dashboard. Shopify sends data to the Node.js service via webhooks, which then uses Prisma to store it in a PostgreSQL database. A scheduled job runs periodically to ensure data integrity. The React dashboard fetches the stored data via the Node.js API to display metrics and visualizations.

![Architecture Diagram](https://drive.google.com/file/d/1pLR52jSVmuBt4lnG6C4A3Pdy5GmQgxAM/view?usp=drivesdk)

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   PostgreSQL
-   Git

### Setup Instructions

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/samyukthanunna/Samyuktha-Xeno-assignment.git]
    cd [https://github.com/samyukthanunna/Samyuktha-Xeno-assignment]
    ```

2.  **Created a `.env` file:**
    

    ```
    # .env
    DATABASE_URL="postgresql://xeno_database_pg5j_user:4thY45XnsqOLlYz7dm90HxG7QEoSxYbQ@dpg-d33ertodl3ps738r087g-a.oregon-postgres.render.com/xeno_database_pg5j"
    SHOPIFY_API_KEY="b445ffcd4c104797a3089be5bbc51c10"
    SHOPIFY_API_SECRET="d581fb5d5a5c3ef79c3515dfc9713a6ccb49c2008f2f44db66542177b1edef72"
    PORT="3000"
    ```

3.  **Install dependencies and run migrations:**
    ```sh
    npm install
    npx prisma migrate dev --name init
    ```

4.  **Run the application:**
    ```sh
    npm run dev
    ```

---

## API Endpoints and Database Schema

### API Endpoints

-   `POST /api/webhooks/shopify`: Receives and processes Shopify webhook events.
-   `GET /api/dashboard/metrics`: Returns total orders, revenue, and customer count for a specific store.
-   `GET /api/dashboard/orders?startDate=&endDate=`: Fetches orders for a specific date range.
-   `GET /api/dashboard/customers/top5`: Returns the top 5 customers by spend.
-   `POST /api/auth/login`: Authenticates a user and provides access to the dashboard.

### Database Schema

-   **`Store`**: `id`, `shopify_store_id`, `access_token`
-   **`Customer`**: `id`, `store_id`, `first_name`, `last_name`, `email`, `total_spent`
-   **`Order`**: `id`, `store_id`, `customer_id`, `order_number`, `total_price`, `created_at`
-   **`Product`**: `id`, `store_id`, `title`, `price`
-   **`User`**: `id`, `email`, `password_hash`, `store_id`

---

## Known Limitations and Assumptions

-   **Real-time Latency:** While webhooks provide near real-time updates, a small delay might occur in data synchronization.
-   **Scalability:** This solution is built for small to medium-sized stores. For large-scale data ingestion (e.g., millions of orders per day), a more robust queuing system like Redis or RabbitMQ would be needed to handle the load and prevent data loss.
-   **Initial Sync:** The initial data sync for a large store might be slow. The current scheduled job approach is not optimized for a massive one-time import.
-   **Assumptions:** Assumes Shopify API rate limits will not be an issue for the scope of this project.

---

## Demo and Deployment

-   **Live Demo:** The application is deployed on **[Deployment Service]** and can be accessed here: **[Link to your deployed service]**
-   **Demo Video:** A full video walkthrough of the features and technical decisions is available on YouTube: **[Link to your YouTube video]**

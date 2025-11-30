# 🧶 Laine Comfort -- Full Stack Application

Spring Boot (Backend) + Angular (Frontend) + MySQL

This project contains three main components:

-   **Product Service** -- Spring Boot (Backend 1)
-   **Order Service** -- Spring Boot (Backend 2)
-   **Front-end Application** -- Angular

------------------------------------------------------------------------

## 📂 Project Structure

    laine-comfort/
    │
    ├── back-end1/
    │   └── product-service/
    │
    ├── back-end2/
    │   └── order-service/
    │
    └── front-end/
        └── angular-app/

------------------------------------------------------------------------

## 🛠 Requirements

Before running the project, you must install:

-   **Java 17**

-   **Node.js 18+**

-   **Angular CLI**

    ``` bash
    npm install -g @angular/cli
    ```

-   **MySQL Server (WAMP SERVCER) **

-   **Maven**

------------------------------------------------------------------------

# 🗄 1. Configure MySQL Databases

Open MySQL and create the databases:

``` sql
CREATE DATABASE product_service_db;
CREATE DATABASE order_service_db;
```

------------------------------------------------------------------------

# 🔧 2. Configure Backend Properties

### 👉 Product Service

Edit the file:\
**`back-end1/product-service/src/main/resources/application.properties`**

    spring.datasource.url=jdbc:mysql://localhost:3306/product_service_db
    spring.datasource.username=root
    spring.datasource.password=YOUR_PASSWORD

    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true

------------------------------------------------------------------------

### 👉 Order Service

Edit the file:\
**`back-end2/order-service/src/main/resources/application.properties`**

    spring.datasource.url=jdbc:mysql://localhost:3306/order_service_db
    spring.datasource.username=root
    spring.datasource.password=YOUR_PASSWORD

    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true

------------------------------------------------------------------------

# 🚀 3. Run Backend Services

### ▶ Run Product Service

    cd back-end1/product-service
    mvn spring-boot:run

Runs on:\
👉 **http://localhost:8080**

------------------------------------------------------------------------

### ▶ Run Order Service

    cd back-end2/order-service
    mvn spring-boot:run

Runs on:\
👉 **http://localhost:8081**

------------------------------------------------------------------------

# 🌐 4. Run the Angular Frontend

    cd front-end
    npm install
    ng serve --open

The frontend will open at:\
👉 **http://localhost:4200**

------------------------------------------------------------------------

# 🔗 Example API Endpoints

### Product Service

    GET  /api/products
    POST /api/products

### Order Service

    GET  /api/orders
    POST /api/orders

------------------------------------------------------------------------

# ✔ Notes

-   Make sure **MySQL is running** before starting the Spring Boot
    backends.
-   Start both backends **before** running the Angular frontend.
-   Replace `YOUR_PASSWORD` in properties files with your real MySQL
    password.
-   Do **NOT** commit passwords or API keys to GitHub.

------------------------------------------------------------------------

# 🎉 Project Ready!

This README explains how to install, configure, and run the entire
project without Docker.

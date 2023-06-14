# Atelier-Microservice-Reviews

This project takes ownership of the reviews service in Atelier's API to better support the Atelier e-commerce application. This service follows the  optimized handling of large quantities of data and traffic. 

## **Table of Contents**
- [Description](#description)
- [Routes](#routes)
- [Optimizations](#optimizations)
- [Scaling](#scaling)
- [Metrics](#metrics)
- [Installation](#installation) 
- [Technologies](technologies)
- [License](#license)

### **Description**

The primary objective of this project is to enhance the reviews service in Atelier's API by implementing robust features and improvements. Through this microservice, users can effectively create, retrieve, and update reviews associated with various products available on the Atelier platform.

### **Routes**
The Atelier-Microservice-Reviews project provides the following routes for managing reviews within the Atelier e-commerce application:

- **GET** /api/reviews/:product_id: Retrieves all reviews for a specific product.
- **GET** /api/reviews/meta/:product_id: Retrieves review metadata for a specific product.
- **POST** /api/reviews: Adds a new review to the database.
- **PUT** /api/reviews/:review_id/helpful: Marks a review as helpful.
- **PUT** /api/reviews/:review_id/report: Reports a review as inappropriate.

### **Optimizations**

To ensure efficient and reliable performance, the Atelier-Microservice project incorporates the following optimizations

- **ETL Process**: Conducted an ETL process to migrate legacy data, removing invalid data and ensuring greater integrity.
- **Data Normalization**: Normalize data to improve consistency and maximize tradeoffs between storage and latency.

    - **Schema for reviews**
    ![](https://recordit.co/D8pvTBdLTb.gif)
- **Data Indexing**: Implemented indexing techniques frequently used in 'WHERE' and 'JOIN' clauses to maximize tradeoffs between storage and latency .

### **Scaling**

To handle large quantities of data and traffic, the Atelier-Microservice-Reviews service incorporates the following scaling strategies:

- **Horizontal Scaling**: Deployed multiple EC2 instances to distribute the load and increase overall capacity.
- **Caching**: Implemented a caching mechanism using Redis to reduce the load on the database and improve response times for frequently accessed data.

- **Load Balancing**: Utilized Nginx to distribute incoming requests across multiple instances via least connections and avoid overwhelming a single server.

    - **Nginx Config**
    ![](https://recordit.co/TuWM6OnQ8j.gif)

## **Metrics**

- **Before Optimizations/Scaling:** 

    - **Query Latency**
    
    ![](https://recordit.co/pGORLySocl.gif)

    - **Throughput**
    
    ![](https://recordit.co/WIGq1LljxQ.gif)


- **After Optimizations/Scaling:**

    - **Query Latency**
    
    ![](https://recordit.co/A0Uu8cxe4p.gif)

    - **Throughput**
    
    ![](https://recordit.co/jy2dtKXHXC.gif)

    - **Usage Statistic**
    
    ![](https://recordit.co/FE8PkotS5H.gif)

### **Installation**

To run this service locally on your machine, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies. Make sure you have Node.js and npm installed. Then, run the following command:
```
npm run install
```
4. Set up the database. This service uses PostgreSQL as the database. Make sure you have PostgreSQL installed and running on your machine. Perform your own ETL process by running the scripts located in folder ETL. Update the database configuration in the _.env_ file with your database credentials. (see env.example files)
5. Start the server. Run the following command:
```
npm run server
```

### **Technologies**

* Node.js
* Express.js
* PostgreSQL (database)
* Redis
* Nginx
* Jest

### License
This project is licensed under the MIT License.





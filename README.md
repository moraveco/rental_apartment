# Rental Apartment Management System

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

A comprehensive web application designed for managing a rental apartment business. This project includes a public-facing booking website and a secure administrative dashboard for managing reservations, finances, customers, and website content.

## 🚀 Key Features

* **Interactive Booking System:** Allows users to check availability, select dates, and book the apartment seamlessly.
* **Admin Dashboard:** A secure control panel providing overviews of financial earnings, occupancy rates, and recent activities.
* **Customer Management:** Centralized database for tracking guest details, booking history, and contact information.
* **Website Editor (CMS):** Built-in content management tools allowing the admin to dynamically update website text, images, and pricing without touching the code.
* **Financial Tracking:** Tools for calculating revenue, managing pricing tiers, and tracking payments.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** PHP 
* **Database:** MySQL

## ⚙️ Prerequisites

To run this project locally, you will need a local server environment (like XAMPP, MAMP, or LAMP stack) with:
* **PHP 8.0** (or higher)
* **MySQL** or MariaDB
* **Apache** or Nginx web server

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/moraveco/rental_apartment.git
cd RentalManagementSystem
```

### 2. Database Setup
* Open your database management tool (e.g., phpMyAdmin).
* Create a new database named `rental_db`.
* Import the provided SQL file located in the `database` folder (`rental_db.sql`) to set up the tables and initial admin credentials.

### 3. Configure the application
Open the `config.php` (or database connection file) and update your credentials:

```php
<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "rental_db";

$conn = new mysqli($host, $username, $password, $database);
?>
```

### 4. Run the application
Start your Apache and MySQL services, and navigate to the project folder in your browser:
```text
http://localhost/RentalManagementSystem
```

## 👨‍💻 Author

**Ondřej Moravec** * GitHub: [@moraveco](https://github.com/moraveco)

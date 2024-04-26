# Car Rental System [Frontend]
Car Rental System is a simple system designed to meet the needs of companies renting cars for days. The app allows users to browse cars available for hire and send requests for car availability on the indicated date, along with a cost calculation. Administrators can easily respond to inquiries and manage cars and users.

The project was created for the purpose of learning to develop the frontend part of the application using React.js and MaterialUI.

**This repository contains only the frontend. Backend of the project - [car-rental-system-spring](https://github.com/Mr-Victor16/car-rental-system-spring)**  
_The proper functioning of the frontend requires the backend to be running._

## Technologies used
+ React.js
+ MaterialUI
+ Axios, Router, Redux
+ Node.js
+ Formik, Yup
+ Docker, Docker Compose

## Features
+ **General:**
  + view cars available for rent,
  + login and registration in the system.
####
+ **User:**
  + rent a car,
  + show a list of rentals,
  + check the current rental status and rental status history,
  + show simple profile and change account password.
####
+ **Administrator:**
  + manage cars (show information, edit, change photo, delete and change visibility),
  + manage rentals (show information, edit, delete, change status),
  + manage users (show list, add, delete, change role).

## How to launch?
+ Use the following command to install the required modules:  
`npm install`
####
+ Use the following command to launch the application:  
`npm start`

## Screenshots
<kbd>![homePage](https://github.com/Mr-Victor16/car-rental-system-react/assets/101965882/880a40a4-9b62-400e-a393-8c2f0c25f377)</kbd>
_Homepage._<br /><br />
<kbd>![register](https://github.com/Mr-Victor16/car-rental-system-react/assets/101965882/ede33a1c-dcba-44fb-9529-b34a1dd3efad)</kbd>
_Registration form._<br /><br />
<kbd>![addCar](https://github.com/Mr-Victor16/car-rental-system-react/assets/101965882/75fe3067-19c0-42b7-98ea-8afeabeb54a3)</kbd>
_New car addition form._<br /><br />
<kbd>![showCarInfo](https://github.com/Mr-Victor16/car-rental-system-react/assets/101965882/171378b4-56e9-479b-8598-1ade4cb41ae4)</kbd>
_Preview of car information._<br /><br />
<kbd>![updateRentalStatus](https://github.com/Mr-Victor16/car-rental-system-react/assets/101965882/30af8412-543d-4971-b1e9-160fde0b52ee)</kbd>
_Preview of the rental list with status update dialog._
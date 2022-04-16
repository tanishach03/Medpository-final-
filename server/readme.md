# MEDPOSITORY Backend

This backend is made using  **Nodejs** &  **Mongodb**.

## Setup
Create a .env file in the root folder and add *two variables*.

**jwtSecret**=*canbeanything* & **mongoURI**=*Url for your mongodb database*.

After installing packages using  `npm install`.

    npm run dev

## Routes

### User 
**/api/user/register** -> *Creates a new User* ~*Public*

**/api/user/login** -> *Login the user* ~*Public*

**/api/user** -> ***Gets** user data* ~*Private*

**/api/user** -> ***Updates** user data* ~*Private*



### Documents 
**/api/document/scans** -> *Upload user scans as png/jpeg* ~*Private*

**/api/document/reports** ->  *Upload user reports as pdf* ~*Private*

**/api/document/scans/filename** ->  *Downloads scans* ~*Private*

**/api/document/scans/filename** ->  *Downloads reports* ~*Private*

**/api/document/scans/allScans** ->  *Get all user scans* ~*Private*

**/api/document/scans/allReports** ->  *Get all user reports* ~*Private*

### Doctors
**/api/doctor/register** -> *Creates a new doctor profile* ~*Public*

**/api/doctor/login** -> *Logins to doctor profile* ~*Public*

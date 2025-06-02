# PullBox Backend
PullBox is a full-stack web application designed for Heroes and Hobbies, a local comic shop, to streamline the comic pull process for both customers and staff. This backend, built with Node.js and Express, handles data parsing, role-based authentication, and pull tracking — replacing inefficient manual workflows and improving on the limitations of existing industry tools.

## Features
- Excel Importing & Parsing:
 Upload Excel sheets from the distributor; the backend parses them and intelligently extracts key information like series titles — even when that data isn’t explicitly labeled.

- Role-Based Authentication:
 Admin-only access for uploading product files, managing users, and exporting pull lists.

- Pull & Subscription Management:
 Track which customers have pulled which titles, across multiple publishers and dates.

- Export for Distributors:
 Staff can export pull data into a format that matches distributor requirements, saving hours of manual work each week.
## Tech Stack
### Backend
 - Node.js / Express – RESTful API structure

- Clerk – Auth & user management (JWT-style, with dashboard support)

 - MySQL – Database for storing users, pulls, and product data

- ExcelJS – Read/write support for distributor Excel files

- Multer – Middleware for file uploads

- Yup – Schema validation for incoming data

- Lodash – Used for utility functions like debouncing

- Axios – HTTP client for internal/external API communication

- Jest – Unit testing framework
## Future Plans
- Support for offline customers who still use paper pull lists

- A system to handle re-orders and special requests for past titles
  
- Recommended products component



# Credits
Huge thanks to @Chad Roberts, my coach through Module 3 of Get Coding, his patience and insight were invaluable. In addition I'd like to thank the rest of the Get Coding community for the support throughout the project.



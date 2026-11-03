# BookNook — A Small Online Library

A modern online library platform where readers can discover books, explore book details, borrow available copies, and manage their personal library.

**Live Demo:** [https://booknook-mehedilabs.vercel.app/](https://booknook-mehedilabs.vercel.app/)

**Backend API:** [https://booknook-server-eight.vercel.app/](https://booknook-server-eight.vercel.app/)

**Repositories:** [Frontend](https://github.com/mehedilabs/booknook-client) · [Backend](https://github.com/mehedilabs/booknook-server)

---

## Overview

BookNook is a full-stack online library application built to make book discovery and borrowing simple and accessible. Users can browse the library, view detailed book information, add and manage their own books, borrow available copies, and track their borrowing history.

The application includes secure authentication, protected user-specific features, image uploads, and a responsive interface designed for desktop and mobile devices.

## Features

- **User Authentication:** Register and sign in using email and password or Google authentication.
- **Book Discovery:** Browse the complete library and explore recently added books.
- **Book Details:** View detailed information about each book, including its author, category, description, and availability.
- **Book Management:** Add, edit, and delete books while maintaining ownership restrictions.
- **Borrowing System:** Borrow available books and prevent duplicate active borrowing of the same book.
- **Borrow History:** View borrowed books and return books when finished.
- **Profile Management:** View account information and update your name and profile picture.
- **Image Uploads:** Upload book cover images through Cloudinary.
- **Responsive Design:** Access the application across desktop, tablet, and mobile devices.
- **User Feedback:** Receive clear feedback through toast notifications and interface states.

## Technology Stack

| Category         | Technologies         |
| ---------------- | -------------------- |
| Framework        | Next.js 16, React 19 |
| Language         | TypeScript           |
| Styling          | Tailwind CSS v4      |
| UI Components    | shadcn/ui, Base UI   |
| Authentication   | Better Auth          |
| Database         | MongoDB              |
| Image Management | Cloudinary           |
| Slider           | Swiper               |
| Icons            | Lucide React         |
| Notifications    | Sonner               |
| Deployment       | Vercel               |

## Application Pages

| Page         | Description                               |
| ------------ | ----------------------------------------- |
| Home         | Featured content and recently added books |
| All Books    | Browse the available library              |
| Book Details | Explore complete book information         |
| Add Book     | Add a new book to the library             |
| My Books     | Manage books added by the signed-in user  |
| My Borrows   | Track and return borrowed books           |
| Profile      | View and update profile information       |
| Login        | Sign in to an account                     |
| Register     | Create a new account                      |

## Screenshots

### Home Page

<img src="./screenshots/home.png" alt="BookNook Home Page" width="700" />

### More Screenshots

- [All Books](./screenshots/all-books.png)
- [Book Details](./screenshots/book-details.png)
- [My Books](./screenshots/my-books.png)
- [My Borrows](./screenshots/my-borrows.png)

## Getting Started

Follow these steps to run the frontend locally.

### Prerequisites

- Node.js and npm
- MongoDB connection string
- Google OAuth credentials (if using Google sign-in)
- A running BookNook backend API

### Installation

Clone the repository:

```bash
git clone https://github.com/mehedilabs/booknook-client.git
```

Navigate to the project directory:

```bash
cd booknook-client
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Replace the placeholder values with your own credentials. Never commit `.env.local` or expose private credentials in the repository.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Backend Integration

The frontend communicates with the BookNook backend API for book and borrowing operations.

**Production API:** [https://booknook-server-eight.vercel.app/](https://booknook-server-eight.vercel.app/)

Set `NEXT_PUBLIC_API_URL` to the appropriate backend URL for your environment.

## Project Repositories

- **Frontend:** [mehedilabs/booknook-client](https://github.com/mehedilabs/booknook-client)
- **Backend:** [mehedilabs/booknook-server](https://github.com/mehedilabs/booknook-server)

## Deployment

The frontend is deployed on Vercel.

**Live Application:** [BookNook](https://booknook-mehedilabs.vercel.app/)

---

Built as a full-stack library management project using modern web technologies.

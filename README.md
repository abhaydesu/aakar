<img src="https://raw.githubusercontent.com/abhaydesu/aakar/main/public/logo2.png" width="150" />

# Aakar - Unified Skill Portfolio

Aakar is a micro-credential aggregator platform designed to empower learners by providing a single, unified, and verifiable portfolio for all their skills and qualifications. In a world of fragmented online learning, Aakar brings together credentials from various platforms, aligns them with the National Skills Qualifications Framework (NSQF), and presents them in a clean, professional format that is ready for employers.

## Key Features

* **Unified Dashboard**: A central hub for users to add, manage, and view all their micro-credentials in one place.
* **Credential Verification**: A multi-tiered verification system to ensure the authenticity of credentials, including a "Verifying" status that simulates a real-world verification process.
* **Recruiter Portal**: A dedicated dashboard for recruiters to search for candidates based on specific skills and technologies.
* **Real-time Chat**: An integrated messaging system allowing recruiters and candidates to connect and communicate directly.
* **Public Profiles**: Users can share a public, verifiable profile of their skills and credentials with a unique, shareable link.
* **Role-based Access**: Separate experiences for "Users" (learners) and "Recruiters" to tailor the platform to their specific needs.
* **Modern Tech Stack**: Built with Next.js, TypeScript, and MongoDB for a fast, scalable, and reliable user experience.

---

## Tech Stack

* **Frontend**:
    * [Next.js](https://nextjs.org/) (v15)
    * [React](https://react.dev/) (v19)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Tailwind CSS](https://tailwindcss.com/) (v4)
    * [Framer Motion](https://www.framer.com/motion/) for animations
* **Backend**:
    * [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
    * [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
    * [NextAuth.js](https://next-auth.js.org/) for authentication
* **Deployment**:
    * Ready for deployment on [Vercel](https://vercel.com/)

---

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v18.18.0 or later)
* [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-based)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/abhaydesu/aakar.git
    cd aakar
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add the following variables:

    ```env
    MONGODB_URI=<your_mongodb_connection_string>
    NEXTAUTH_URL=<your_development_url>  # e.g., http://localhost:3000
    NEXTAUTH_SECRET=<your_nextauth_secret> # Generate a secret using: openssl rand -base64 32
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## API Endpoints

* **Authentication**:
    * `GET /api/auth/[...nextauth]`: Handles Google OAuth authentication.
    * `POST /api/user/role`: Sets the user's role (user or recruiter).
    * `POST /api/user/slug`: Sets the user's public profile slug.
* **Credentials**:
    * `GET /api/credentials`: Fetches all credentials for the authenticated user.
    * `POST /api/credentials`: Adds a new credential.
    * `PATCH /api/credentials`: Updates a credential's status.
    * `DELETE /api/credentials`: Deletes a credential.
* **Chat**:
    * `POST /api/chat/messages`: Fetches new chat messages.
    * `POST /api/chat/send`: Sends a new chat message.
    * `POST /api/chat/mark-read`: Marks messages as read.
    * `GET /api/chat/unread-chats`: Gets the count of unread chats.
* **Search**:
    * `POST /api/search/users`: Searches for users by their skills.

---

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

## Acknowledgements

This project was created by **Team HEXADECIMAL**.

* Kushagra Shukla
* Abhay Singh
* Angelica Singh
* Aditya
* Abhimanyu Dutta
* Prajakta Naik

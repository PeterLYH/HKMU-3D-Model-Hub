HKMU 3D Model Hub (Version 1.0.0)HKMU 3D Model Hub is a web application that allows users to upload, view, and download 3D models (.obj, .mtl, .glb) with static preview images. It features user authentication, profile management with customizable nicknames and icons, and a modern UI styled with Tailwind CSS. The backend uses Node.js with Express, MongoDB for user data, and Supabase for file storage.FeaturesUser Authentication:Register and log in using username or email with a password.
User profiles include role (default: user), nickname, and a profile icon (image).
JWT-based authentication for secure access.

3D Model Management:Upload 3D models (.obj, .mtl, .glb) with a 50MB file size limit.
Generate and display static preview images (.png) for models instead of interactive 3D rendering.
Download models and view previews in the browser.

Profile Management:Update user nickname and upload a profile icon (.png or .jpeg).
Display user nickname and icon in the navigation bar.

UI/UX:Responsive design using Tailwind CSS.
Pages: Home (model upload/view), Login, Register, Profile, Contact.
Navigation bar with dynamic links based on authentication status.

Backend:Node.js/Express server with REST API.
MongoDB database (HKMU 3D Model) for user data.
Supabase for storing 3D models, preview images, and user icons.

Contact Form:Submit feedback via a contact form (logged in backend console).

PrerequisitesNode.js (v16 or higher): Download
MongoDB Atlas Account: For user data storage Sign up
Supabase Account: For file storage Sign up
Git: To clone the repository Download

Setup Instructions1. Clone the Repositorybash

git clone <repository-url>
cd hkmu

2. Set Up BackendNavigate to the server directory:bash

cd server

Install backend dependencies:bash

npm install

Configure environment variables:Create a server/.env file with the following:env

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.csbtasx.mongodb.net/HKMU%203D%20Model?retryWrites=true&w=majority&appName=Cluster0
SUPABASE_URL=https://<your-supabase-project>.supabase.co
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
JWT_SECRET=<your-jwt-secret>

Replace <username>, <password>, <your-supabase-project>, <your-supabase-anon-key>, <your-supabase-service-role-key>, and <your-jwt-secret> with your credentials.
Get MongoDB URI from MongoDB Atlas (Database > Connect > Drivers).
Get Supabase keys from Supabase Dashboard (Settings > API).
Generate a secure JWT_SECRET (e.g., a random string like x7kP9mW3qT2rY8vN5zL1jF6hB4cD0aE2iG8uJ3tR9wQ).

Set up Supabase:Create a models bucket in Supabase (Storage > New Bucket).
Add a public read policy:sql

create policy "Allow public downloads"
on storage.objects
for select
using (bucket_id = 'models');

Run the backend:bash

npm start

Confirm: Connected to MongoDB (HKMU 3D Model) and Server running on http://localhost:5000.

3. Set Up FrontendNavigate to the client directory:bash

cd ../client

Install frontend dependencies:bash

npm install

Run the frontend:bash

npm run dev

Open http://localhost:5173 in your browser.

4. Project Structure

hkmu/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Navigation bar with user nickname and icon
│   │   │   ├── Footer.jsx     # Footer with branding
│   │   │   └── ContactForm.jsx # Contact form component
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Main page for uploading/viewing models
│   │   │   ├── Login.jsx      # Login page (username or email)
│   │   │   ├── Register.jsx   # Registration page with nickname/icon
│   │   │   ├── Profile.jsx    # Profile management page
│   │   │   └── Contact.jsx    # Contact page
│   │   ├── App.jsx            # Main app with routing
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind CSS styles
│   ├── public/
│   ├── vite.config.js         # Vite configuration
│   └── package.json
├── server/
│   ├── index.js               # Express server with API routes
│   ├── .env                   # Environment variables
│   └── package.json
└── README.md                  # This file

5. MongoDB SetupDatabase: HKMU 3D Model
Collection: users
Schema:json

{
  "username": String,  // Unique
  "email": String,    // Unique
  "password": String, // Hashed
  "role": String,     // Default: "user", Enum: ["user", "admin"]
  "nickname": String, // Default: ""
  "icon": String      // URL to Supabase icon, Default: ""
}

If migrating from a previous database (e.g., test):bash

mongodump --uri "mongodb+srv://<username>:<password>@cluster0.csbtasx.mongodb.net/test" --out ./backup
mongorestore --uri "mongodb+srv://<username>:<password>@cluster0.csbtasx.mongodb.net/HKMU%203D%20Model" --db "HKMU 3D Model" ./backup/test

UsageRegister:Go to http://localhost:5173/register.
Enter username, email, password, optional nickname, and upload a .png/.jpeg icon.
Redirects to / after successful registration.

Login:Go to http://localhost:5173/login.
Log in with username or email and password.
Stores token, userId, nickname, and icon in localStorage.

Upload Models:On the Home page (/), select .obj/.mtl or .glb files and upload.
A .png preview is generated and stored in Supabase.
Models are listed with options to Download or View (displays preview image).

Profile Management:Go to /profile to update nickname or upload a new icon.
Updated nickname and icon appear in the navbar.

Contact:Go to /contact to submit feedback (logged in backend console).

API EndpointsPOST /api/register: Register a user (username, email, password, nickname).
POST /api/login: Log in with identifier (username or email) and password.
POST /api/profile: Update nickname and/or icon (requires JWT).
POST /api/models: Upload 3D models and previews (requires JWT).
GET /api/models: List user’s models (requires JWT).
GET /api/models/:fileName: Download a model or preview (requires JWT).
POST /api/contact: Submit contact form data.

TroubleshootingMongoDB Connection Error:Verify MONGODB_URI in server/.env.
Test connection in MongoDB Atlas (Connect > Compass).

Supabase 400 Bad Request:Ensure files (e.g., Tree1.mtl) are uploaded to Supabase (models/<userId>/).
Check public read policy in Supabase.

Preview Image Not Generated:Check console (F12 > Console) for errors like MTL file not found.
Upload .mtl with .obj or use a .glb file.

Reinstall Dependencies:bash

cd client
rm -rf node_modules package-lock.json
npm install
cd ../server
rm -rf node_modules package-lock.json
npm install

Known LimitationsPreview images are generated client-side, which may fail for complex models or if WebGL is unsupported.
No admin-specific features (e.g., user management) in v1.0.0.
Contact form submissions are logged but not stored or emailed.

Future ImprovementsAdd admin role functionality (e.g., manage users/models).
Implement server-side preview image generation (e.g., using Blender in Docker).
Add support for model metadata (e.g., tags, descriptions).
Enhance contact form to store or email submissions.

Version Historyv1.0.0 (September 2025):Initial release with user authentication, model upload/download, preview images, profile management, and Tailwind CSS UI.
MongoDB database: HKMU 3D Model.
Supabase for file storage (models, previews, icons).
Branding: HKMU 3D Model Hub.

License&copy; 2025 HKMU 3D Model Hub. All rights reserved.


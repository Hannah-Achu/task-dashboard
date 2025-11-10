🧭 Task Dashboard

A clean and efficient personal task management web app built to help users organize their daily goals.
The dashboard allows you to add, edit, delete, and mark tasks as completed, with secure email-based authentication for sign-in and sign-up.

🚀 Live Demo: task-dashboard-lvk6.vercel.app

🧩 Features

✅ Add new tasks

✏️ Edit existing tasks

🗑️ Delete tasks

🎯 Mark tasks as completed (under progress)

🔐 Authentication with email and password (sign in / sign up)

📱 Responsive and minimal UI

🛠️ Tech Stack
Technology	Purpose
TypeScript	Main language (93.4%)
React + Vite	Frontend framework
Tailwind CSS	Styling and layout
Supabase	Authentication and database
Vercel	Deployment
⚙️ Installation & Setup

Follow these steps to run the project locally:

# 1. Clone the repository
git clone https://github.com/<your-username>/task-dashboard.git
cd task-dashboard

# 2. Install dependencies
npm install

# 3. Create a .env file in the root directory
# Add your Supabase credentials
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# 4. Start the development server
npm run dev

💡 Future Enhancements

📅 Task deadlines and reminders

🧠 Category-based task organization

🌙 Dark mode

📊 Analytics dashboard

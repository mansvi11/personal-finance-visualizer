💸 Personal Finance Visualizer
A modern, responsive finance dashboard built with Next.js, TypeScript, MongoDB, and Tailwind CSS — featuring income/expense tracking, budget monitoring, savings goals, and elegant light/dark mode support.

✅ Live demo: View on Vercel

✨ Features
✅ Add income and expenses with category, type, and date

📊 Dynamic analytics via monthly bar and pie charts (Recharts)

🎯 Savings goals tracker with progress bars

📉 Budget limits per category

🌗 Light/Dark mode toggle

⚡ Instant feedback with Sonner notifications

🎨 Pastel UI theme with smooth animations (Framer Motion)

🛠️ Tech Stack
Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

UI Enhancements: Framer Motion, Sonner

Database: MongoDB (via Mongoose)

Hosting: Vercel

Charts: Recharts

🧑‍💻 Getting Started
git clone https://github.com/mansvi11/personal-finance-visualizer.git
cd personal-finance-visualizer
npm install

Create a .env.local file:
MONGODB_URI=your-mongodb-connection-string

Then start the development server:
npm run dev

📁 Project Structure
.
├── app
│   ├── page.tsx             # Main UI Page
│   ├── api
│   │   ├── transactions     # CRUD for Transactions
│   │   ├── budgets          # Budget limits per category
│   │   └── goals            # Saving goals
├── models                   # Mongoose models
│   ├── transaction.ts
│   ├── budget.ts
│   └── goal.ts
├── lib
│   └── mongodb.ts           # Database connection logic


🚀 Deployment
Deployed on Vercel. Any push to the main branch will auto-deploy:
git add .
git commit -m "Updated dashboard UI and functionality"
git push origin main

📝 To Do
 Add auth with Clerk/Auth.js

 Export reports as CSV

 Filter/search transactions

 Mobile view optimization

📬 Contact
For queries or collaboration, reach out at mansvishukla2006@gmail.com

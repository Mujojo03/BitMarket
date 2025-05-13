# BitMarket - Bitcoin-Powered Marketplace

BitMarket is a global marketplace powered by Bitcoin and the Lightning Network, enabling peer-to-peer commerce without borders or gatekeepers.

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **Authentication**: Custom authentication with local storage (for demo purposes)
- **Routing**: Next.js App Router

## Features

- User authentication (login/register)
- Product browsing and filtering
- Shopping cart functionality
- Seller dashboard
- Product management
- Order tracking
- Lightning wallet integration
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/Mujojo03/BitMarket.git
   cd BitMarket
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable React components
- `/contexts` - React Context providers
- `/lib` - Utility functions, types, and mock data
- `/public` - Static assets

## Pushing to GitHub

To push this code to your GitHub repository:

\`\`\`bash
# Initialize git repository (if not already done)
git init

# Add all files to staging
git add .

# Commit changes
git commit -m "Initial commit: BitMarket frontend"

# Add remote repository
git remote add origin https://github.com/Mujojo03/BitMarket.git

# Create and switch to the frontend-nextjs branch
git checkout -b frontend-nextjs

# Push to GitHub
git push -u origin frontend-nextjs
\`\`\`

## Backend Integration

This frontend is designed to be connected to a Flask backend. The API service functions in `/lib/api-service.ts` are structured to make this transition easy.

## License

[MIT](LICENSE)
\`\`\`

Let's create a package.json file:

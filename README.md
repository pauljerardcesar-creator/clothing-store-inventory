# Clothing Store Inventory System

Hi! This is my project for IFN636 (Assessment 1). It's an app to help a small
clothing shop keep track of their stock.

## What this app does

- Staff can log in with a username and password
- You can see a list of all the clothing products and how much stock is left
- Admins can add new products
- Staff can record a sale (stock goes down) or a restock (stock goes up)
- If you try to sell more than what's in stock, the app stops you and shows
  an error

## How it's built (in simple terms)

- **frontend** - what you see and click on (built with React)
- **backend** - the behind-the-scenes part that saves and checks data
  (built with Node.js and Express)
- **MongoDB** - where all the data actually gets saved

## How to run it

1. Install Node.js from nodejs.org if you don't have it
2. In the `backend` folder:
   ```
   npm install
   ```
   Then copy `.env.example` to `.env` and fill in your own MongoDB link.
   Then run:
   ```
   node seed.js
   npm run dev
   ```
3. In a new terminal, in the `frontend` folder:
   ```
   npm install
   npm run dev
   ```
4. Open the address it gives you in your browser

## Known limitations

- Dashboard, Transaction History, and Manage Staff Accounts pages from my
  Figma designs aren't built yet
- No automated tests yet
- No CI/CD - deployment is done manually, as required by the assignment

## Deployment link

*(Will be added once Task 5 - EC2 deployment - is complete.)*

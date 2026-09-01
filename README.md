Clothing Store Inventory System

Hi! This is my project for IFN636 (Assessment 1). It's an app to help a small clothing shop keep track of their stock — things like how many t-shirts or pants they have left, in what size and colour, and when items are sold or restocked.

What this app does
Staff can log in with a username and password
You can see a list of all the clothing products and how much stock is left
Admins can add new products, or edit/delete existing ones
Staff can record a sale (stock goes down) or a restock (stock goes up)
If you try to sell more than what's in stock, the app stops you and shows an error
Admins can also manage staff accounts (turn accounts on/off)
How it's built (in simple terms)

This project has two main parts:

frontend — this is what you actually see and click on in the browser (built with React)
backend — this is the "behind the scenes" part that talks to the database and does the actual saving/checking (built with Node.js and Express)
The data (products, stock numbers, staff accounts) is saved in a database called MongoDB

Think of the frontend as the shop counter, and the backend as the stockroom — the counter doesn't hold anything itself, it just asks the stockroom for information and shows it to you.

How to run it on your own computer
Make sure you have Node.js installed (you can download it from nodejs.org)
Open the backend folder in a terminal and run:
   npm install
   npm run dev
Open the frontend folder in another terminal and run:
   npm install
   npm run dev
Open the link it gives you in your browser

You'll also need a free MongoDB database — instructions for setting one up are in the backend folder.

Things that aren't finished yet
The Dashboard and Transaction History screens shown in my Figma designs aren't connected to real data yet
There are no automated tests yet
There's no "forgot password" option
This app isn't set up to run automatically when I make changes (no CI/CD) — I install and run it manually, since that's what the assignment asks for
Where the live version is

(I'll add the working link here once I finish deploying it to AWS EC2 for Task 5 of the assignment.)

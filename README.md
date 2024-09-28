## Getting Started

First, clone and build the project:
```bash
1. git clone
2. cd hundred-thousand-row-main
2. npm run build
3. npm run start
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Overview
Our goal is to render 100,000 rows with their respective squares in each row, while managing slow API response times and ensuring minimal lag on the frontend.

### Problems Faced
React is very bad at rendering large lists, tabular data, and grids efficiently. This can lead to a laggy and unusable user interface. 

To address these issues, I implemented `Virtualization`, and fetching the square of integers in parallel.

#### Key Features:
- **Fetch and Display Squares**: The squares of integers are fetched from an API and displayed in a table.
- **Batched Loading**: Integers are loaded in batches of 25 at a time, starting from 1 up to 100,000.
- **Parallel Fetching**:  The square of the integers is fetched in parallel.
- **Infinite Scrolling**: More integers and their squares are fetched when the user scrolls to the end of the table.

#### Main Components:
1. **`sqrs` State**: Stores integers and their corresponding squares as an object.
   - Example: `{ 1: { sqr: 1 }, 2: { sqr: 4 }, ... }`

2. **`useEffect`**: Initially loads the first sets of squares (integers 1-25).

3. **`fetchAndUpdateSquares(from)`**: Fetches squares for a given range of integers from the API and updates the `sqrs` state.
   - **Steps**:
     1. Initialize placeholders for the squares (`null` values).
     2. Fetch squares from the `/api/square` endpoint.
     3. Update the state with the fetched squares.

4. **`fetchMoreRows(e)`**: Fetches the next sets of squares when the user scrolls to the end of the table.

#### Virtualized Table:
- **`TableVirtuoso`**: Renders the list of integers and their squares, optimizing for performance by only rendering rows visible in the viewport.
- **Scrolling**: Automatically loads more rows when the user reaches the end.

#### Example API Call:
The API request is a `POST` request to `/api/square` with the integer as the payload, which returns the square of that integer.

```json
{
  "integer": 1
}
```
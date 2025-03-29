# STM GTFS Bus Visualizer

A real-time bus tracking application that visualizes STM bus stops and live positions using GTFS data.

## 🚀 Features

-   Displays STM bus stops from GTFS `stops.txt`
-   Shows real-time bus locations based on GTFS-RT
-   Filters buses by route and stop

## 🛠️ Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/haecheonlee/frontend.git
    cd frontend/project/stm
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Generate the sqlite database and migrations

    ```sh
    npm run db:migration
    ```

4. Run the development server:

    ```sh
    npm run dev
    ```

## 🚍 Usage

1. Open `http://localhost:3000` in your browser.
2. Select a stop to view all the related routes.
3. Choose a route
4. Track real-time bus locations on the map.

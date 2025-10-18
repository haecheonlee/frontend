import React from "react";
import Card from "../../../../ui/Card";
import { useFetchDataWithCache } from "../../../../hooks/useFetchDataWithCache";

export const RealtimeDataVisualizationChart: React.FC = () => {
    const { data, loading, error } = useFetchDataWithCache("/api/chart-data");

    return (
        <Card>
            <h3>Real-time Data Visualization</h3>
            {loading && <p>Loading chart data...</p>}
            {error && <p>Error loading data</p>}
            <div
                style={{
                    height: "200px",
                    background: "#1e293b",
                    borderRadius: "4px",
                }}
            >
                Chart Area {data && "(Data loaded)"}
            </div>
        </Card>
    );
};

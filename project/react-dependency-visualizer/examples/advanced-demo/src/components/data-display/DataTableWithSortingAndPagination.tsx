import React from "react";
import { PrimaryButton } from "../../ui/Button";
import { useFetchDataWithCache } from "../../hooks/useFetchDataWithCache";
import { formatDate } from "../../utils/formatters";

export const DataTableWithSortingAndPagination: React.FC = () => {
    const { data, loading } = useFetchDataWithCache("/api/users");

    if (loading) {
        return <div>Loading table data...</div>;
    }

    return (
        <div style={{ marginTop: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                        <th style={{ padding: "10px", textAlign: "left" }}>
                            Name
                        </th>
                        <th style={{ padding: "10px", textAlign: "left" }}>
                            Email
                        </th>
                        <th style={{ padding: "10px", textAlign: "left" }}>
                            Status
                        </th>
                        <th style={{ padding: "10px", textAlign: "left" }}>
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "10px" }}>John Doe</td>
                        <td style={{ padding: "10px" }}>john@example.com</td>
                        <td style={{ padding: "10px" }}>Active</td>
                        <td style={{ padding: "10px" }}>
                            {formatDate(new Date())}
                        </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "10px" }}>Jane Smith</td>
                        <td style={{ padding: "10px" }}>jane@example.com</td>
                        <td style={{ padding: "10px" }}>Active</td>
                        <td style={{ padding: "10px" }}>
                            {formatDate(new Date())}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style={{ marginTop: "15px" }}>
                <PrimaryButton />
            </div>
        </div>
    );
};

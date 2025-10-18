import React from "react";
import Card from "../../../../ui/Card";
import { Badge } from "../../../../ui/Badge";

export const UserActivityTimelineWidget = () => (
    <Card>
        <h3>User Activity Timeline</h3>
        <div>
            <p>
                Recent Activity <Badge />
            </p>
            <p>
                Last Login <Badge />
            </p>
        </div>
    </Card>
);

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IActivity, IActivityResponse } from "@/lib/interfaces/activity-interface";
import {
  EllipsisVertical,
  ArrowUpDown,
  ArrowUpWideNarrow,
  ArrowDownNarrowWide,
} from "lucide-react";
import React, { useState } from "react";
import ActivityListSkeleton from "@/components/presentational/activity-list-skeleton";
import ActivityListPagination, {
  Pagination,
} from "@/components/common/pagination";
import ActivityIcon from "./activity-type-with-icon";
import { formatDate } from "@/lib/utils/format-date";
import { eventDirectionIcons } from "@/constants/activity-types";
import { sortData, ISortConfig } from "@/lib/utils/sort-data";
import { ActivityPagination } from "./activity-pagination";

interface ActivityListProps {
  activities?: IActivityResponse;
  isFetching: boolean;
}

export const ActivityList = ({ activities, isFetching }: ActivityListProps) => {
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const [sortConfig, setSortConfig] = useState<ISortConfig<IActivity> | null>({
    key: "timestamp",
    direction: "descending",
  });

  const sortedActivities = React.useMemo(
    () => sortData(activities?.items ?? [], sortConfig),
    [activities, sortConfig]
  );

  const requestSort = (key: keyof IActivity) => {
    let direction: "ascending" | "descending" | null = "ascending";
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null;
      }
    }
    setSortConfig(direction ? { key, direction } : null);
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig) return <ArrowUpDown size={15} />;
    if (sortConfig.key !== key) return <ArrowUpDown size={15} />;
    return sortConfig.direction === "ascending" ? (
      <ArrowUpWideNarrow size={15} />
    ) : (
      <ArrowDownNarrowWide size={15} />
    );
  };

  if (isFetching) {
    return <ActivityListSkeleton />;
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => requestSort("timestamp")}>
              Date {getSortIcon("timestamp")}
            </TableHead>
            <TableHead onClick={() => requestSort("userName")}>
              User {getSortIcon("userName")}
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedActivities && sortedActivities.length > 0 ? (
            sortedActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{formatDate(activity.timestamp)}</TableCell>
                <TableCell>{activity.userName}</TableCell>

                <TableCell className="flex items-center gap-2">
                  {
                    <>
                      {React.createElement(
                        eventDirectionIcons[activity.eventName.toUpperCase()]
                          .icon,
                        {
                          className:
                            eventDirectionIcons[
                              activity.eventName.toUpperCase()
                            ].colorClass,
                          size: 20,
                        }
                      )}
                      <span
                        className={
                          eventDirectionIcons[activity.eventName.toUpperCase()]
                            .colorClass
                        }
                      >
                        {
                          eventDirectionIcons[activity.eventName.toUpperCase()]
                            .value
                        }
                      </span>
                    </>
                  }
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ActivityPagination activities={activities} />
    </div>
  );
};

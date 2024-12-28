"use client";

import CirclesChart from "@/components/circles-chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkClockSummaryTable } from "@/components/work-clock-summary-table";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import mondayService from "@/services/monday.service";
import { DataPerMonth } from "@/types/table.type";
import UnauthorizedPopup from "@/components/unauthorized-popup";
import TokenPopup from "@/components/token-popup";
import useGlobalPopup from "@/store/useGlobalPopup";
import { useAuthStore } from "@/store/useAuthStore";
import { log } from "console";

const views = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export default function Home() {
  const openGlobalPopup = useGlobalPopup((state) => state.openPopup);
  const token = useAuthStore((state) => state.token);
  const logUserIn = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 11, 31),
  });
  const [data, setData] = useState<DataPerMonth[] | null>(null);

  useEffect(() => {
    mondayService
      .getWCData()
      .then((data) => {
        logUserIn({ name: data.me });
        setData(data.byMonthOrder);
      })
      .catch((error) => {
        openGlobalPopup();
      });
  }, [token]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Welcome back{user && `, ${user?.name}`}!
      </h1>
      <p className="text-muted-foreground">
        View employee work hours by day, week, month, or project
      </p>
      <TokenPopup />
      <div className="flex justify-between gap-4">
        <DateRangePicker />
        <Tabs value={"day"} onValueChange={() => {}}>
          <TabsList>
            {views.map((v) => (
              <TabsTrigger key={v.value} value={v.value}>
                {v.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className=" md:flex w-full justify-center">
        <WorkClockSummaryTable
          view="day"
          dateRange={dateRange}
          data={data as DataPerMonth[]}
        />
        <CirclesChart />
      </div>
    </div>
  );
}

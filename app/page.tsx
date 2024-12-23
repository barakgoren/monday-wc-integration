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

const views = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export default function Home() {
  const openGlobalPopup = useGlobalPopup((state) => state.openPopup);
  const token = useAuthStore((state) => state.token);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 11, 31),
  });
  const [data, setData] = useState<DataPerMonth[] | null>(null);

  useEffect(() => {
    mondayService
      .getWCData()
      .then((data) => {
        setData(data.byMonthOrder);
      })
      .catch((error) => {
        console.log({ error });

        openGlobalPopup();
      });
  }, [token]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Employee Work Clock Summary</h1>
      <p className="text-muted-foreground">
        View employee work hours by day, week, month, or project
      </p>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <DateRangePicker />
        <TokenPopup />
        <Tabs
          value={"day"}
          onValueChange={() => {}}
          className="w-full sm:w-auto"
        >
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

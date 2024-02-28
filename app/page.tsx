import DataTable from "@/components/data-table";
import { User } from "@/app/types/User";
import config from "@/app/config";
export default async function Home() {
  const data: User[] = await getData();
  console.log("data:", data);
  return (
    <div className="container mx-auto p-4">
      <DataTable data={data} />
    </div>
  );
}

async function getData() {
  const res = await fetch(`${config.apiBaseUrl}`, { cache: "no-store" });
  return res.json();
}

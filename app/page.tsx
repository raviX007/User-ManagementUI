import DataTable from "@/components/data-table";
import { User } from "@/app/types/User";
import config from "@/app/config";
import NavBar from "@/components/navbar";
export default async function Home() {
  const data: User[] = await getData();
  console.log("data:", data);
  return (
    <>
      <NavBar/>

      <div className="container mx-auto p-4">
        <DataTable data={data} />
      </div>
    </>
  );
}

async function getData() {
  //console.log("url:",`${config.apiBaseUrl}`)
  const res = await fetch(`${config.apiBaseUrl}`, { cache: "no-store" });
  return res.json();
}

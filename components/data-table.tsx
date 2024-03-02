"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { EditIcon } from "lucide-react";
import config from "@/app/config";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/app/types/User";

import AddUser from "./add-user";
import EditUser from "./edit-user";

import UserAlert from "./custom-alert";

const DataTable: React.FC<{ data: User[] }> = ({ data }) => {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const [rowData, setRowData] = React.useState<User>({
    id: 0,
    name: "",
    phoneNumber: "",
    email: "",
    hobbies: "",
  });
  const [alertMessage, setAlertMessage] = React.useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  const sendEmail = async (emailData: User[]) => {
    let result = false;
    const res = await fetch(`${config.apiBaseUrl}/mail/sendMail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailData,
      }),
    });
    if (res.ok) {
      result = true;
      
    }

    return result;
  };

  const handleSendEmail = async () => {
   
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const emailData: User[] = selectedRows.map((obj) => obj.original);
    console.log("emailData", emailData);
    if(emailData.length==0){
      setIsAlertOpen(true)
      setAlertMessage("Please select one or more row")
    }else{
      const result = await sendEmail(emailData);
    setIsAlertOpen(true);
    if (result) {
      setAlertMessage("Email sent successfully");
    } else {
      setAlertMessage("Could not send email");
    }
    }
    
  };

  const deleteUser = async (id: number) => {
    let result = false;
    const res = await fetch(`${config.apiBaseUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    
    if (res.ok) {
      result = true;
      
    }

    return result;
  };

  const handleRowDelete = async (id: number) => {
    

    const result = await deleteUser(id);

    setIsAlertOpen(true);
    if (result) {
      setAlertMessage("User Deleted Successfully");
    } else {
      setAlertMessage("Failed to Delete User");
    }
  };

  const handleEdit = async (row: any) => {
    

    const editData: User = {
      id: row.id,
      name: row.name,
      phoneNumber: row.phoneNumber,
      email: row.email,
      hobbies: row.hobbies,
    };
    console.log("editData", editData);
    setRowData(editData);
    setIsEditDialogOpen(true);
    
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: () => <div className="text-center">Contact</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.getValue("phoneNumber")}
          </div>
        );
      },
    },
    {
      accessorKey: "hobbies",
      header: () => <div className="text-center">Hobbies</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.getValue("hobbies")}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-center items-center">
            <span className="mr-2 text-gray-400 cursor-pointer">
              <EditIcon onClick={() => handleEdit(user)} />
            </span>
            <span className=" text-red-400 cursor-pointer">
              <div></div>
              <Trash2 onClick={() => handleRowDelete(user.id)} />
            </span>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleAddUser = () => {
    setIsAddUserDialogOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button className="mr-4" onClick={handleAddUser}>
          Add User
        </Button>
        <Button onClick={handleSendEmail}>Send Email</Button>
      </div>

      <div>
        {isEditDialogOpen ? (
          <div>
            {" "}
            <EditUser data={rowData} isOpen={true} />{" "}
          </div>
        ) : (
          <p> </p>
        )}
      </div>
      <div>
        {isAddUserDialogOpen ? (
          <div>
            {" "}
            <AddUser isOpen={true} />{" "}
          </div>
        ) : (
          <p> </p>
        )}
      </div>
      <div>
        {isAlertOpen ? (
          <div>
            {" "}
            <UserAlert message={alertMessage} isOpen={true} />{" "}
          </div>
        ) : (
          <p> </p>
        )}
      </div>
    </div>
  );
};
export default DataTable;

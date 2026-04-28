import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DEPARTMENT_OPTIONS } from "@/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTable } from "@refinedev/react-table";
import { Search } from "lucide-react";
import { Subject } from "@/types";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const departmentFilters =
    selectedDepartment === "all"
      ? []
      : [
          {
            field: "department",
            operator: "eq" as const,
            value: selectedDepartment,
          },
        ];

  const searchFilter = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const subjectsTable = useTable<Subject>({
    columns: useMemo<ColumnDef<Subject>[]>(
      () => [
        {
          accessorKey: "code",
          header: () => <p className="column-title">Code</p>,
          cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
        },
        {
          accessorKey: "name",
          header: () => <p className="column-title">Name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
        },
        {
          accessorKey: "department",
          header: () => <p className="column-title">Department</p>,
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue<string>()}</Badge>
          ),
        },
        {
          accessorKey: "description",
          header: () => <p className="column-title">Description</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground line-clamp-2">
              {getValue<string>()}
            </span>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "subjects",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent:
          departmentFilters.length || searchFilter.length
            ? [...departmentFilters, ...searchFilter]
            : [],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Subjects</h1>

      <div className="intro-row">
        <div className="action-row">
          <p>Quick access to essential metrics and management tools</p>

          <div className="flex items-center gap-2">
            <div className="search-field">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search for subjects..."
                className="input-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="select-trigger">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENT_OPTIONS.map((department) => (
                  <SelectItem key={department.value} value={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="select-trigger">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>

              <SelectContent className="z-50">
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENT_OPTIONS.map((department) => (
                  <SelectItem key={department.value} value={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <DataTable table={subjectsTable} />
      </div>
    </ListView>
  );
};

export default SubjectsList;

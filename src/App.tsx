import { useState } from "react";
import InputField from "./components/InputField/InputField";
import DataTable, { type Column } from "./components/DataTable/Datatable";

function App() {
  const [value, setValue] = useState("");

  type Person = { id: number; name: string; age: number };

const data: Person[] = [
  { id: 1, name: "Alice", age: 24 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Mob", age: 50 },
];

const columns: Column<Person>[] = [
  { key: "id", title: "ID", dataIndex: "id", sortable: true },
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "age", title: "Age", dataIndex: "age", sortable: true },
];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">UI Components Demo</h1>

      {/* InputField Demo */}
      <InputField
        label="Name"
        placeholder="Enter your name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        helperText="This is a helper text"
        variant="outlined"
        size="md"
      />

      {/* DataTable Demo */}
      <DataTable data={data} columns={columns} selectable />
    </div>
  );
}

export default App;

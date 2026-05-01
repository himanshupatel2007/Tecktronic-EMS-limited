import { useLocation } from "react-router-dom";

export default function ChecklistReport() {
  const { state } = useLocation();
  const data = state?.checklist;

  if (!data) return <div>No Data</div>;

  return (
    <div className="p-6 bg-white text-black">
      <h1 className="text-xl font-bold text-center">
        TEST REPORT OF MASTER BOX PACKING
      </h1>

      <div className="mt-4">
        <p><b>Checklist:</b> {data.checklistName}</p>
        <p><b>Code:</b> {data.checklistCode}</p>
        <p><b>Product:</b> {data.applicableProduct}</p>
      </div>

      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th>Sr</th>
            <th>Parameter</th>
            <th>Sub</th>
            <th>Type</th>
            <th>Min</th>
            <th>Max</th>
            <th>Tool</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.name}</td>
              <td>{item.subName}</td>
              <td>{item.valueType}</td>
              <td>{item.min}</td>
              <td>{item.max}</td>
              <td>{item.tool}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => window.print()}
        className="mt-4 border px-4 py-2"
      >
        Print / Download
      </button>
    </div>
  );
}
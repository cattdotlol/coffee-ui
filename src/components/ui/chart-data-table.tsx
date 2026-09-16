export default function ChartDataTable({ caption, headers, rows }: { caption: string; headers: readonly string[]; rows: readonly (readonly string[])[] }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row">{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  )
}

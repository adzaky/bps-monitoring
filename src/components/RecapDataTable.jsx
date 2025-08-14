import { DataTable } from "@/components/ui/data-table";

export default function RecapDataTable({ data }) {
  const columns = [
    {
      accessorKey: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "id_transaksi",
      header: "ID Transaksi",
      filterFn: "includesString",
    },
    {
      accessorKey: "nama_pengguna",
      header: "Nama Pengguna",
      filterFn: "includesString",
      cell: ({ row }) => {
        const value = row.original.nama_pengguna;
        return <span className="block whitespace-pre-wrap">{value}</span>;
      },
    },
    {
      accessorKey: "jenis_layanan",
      header: "Jenis Layanan",
      filterFn: "includesString",
    },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
      filterFn: "includesString",
    },
    {
      accessorKey: "tanggal_permintaan",
      header: "Tanggal Permintaan",
      filterFn: "includesString",
    },
    {
      accessorKey: "tanggal_selesai",
      header: "Tanggal Selesai",
      filterFn: "includesString",
    },
    {
      accessorKey: "capaian",
      header: "Capaian",
      filterFn: "includesString",
    },
    {
      accessorKey: "petugas",
      header: "Petugas",
      filterFn: "includesString",
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

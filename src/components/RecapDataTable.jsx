import { DataTable } from "./ui/data-table";

export default function RecapDataTable({ data }) {
  const columns = [
    {
      accessorKey: "no",
      header: "No",
    },
    {
      accessorKey: "id_transaksi",
      header: "ID Transaksi",
    },
    {
      accessorKey: "nama_pengguna",
      header: "Nama Pengguna",
    },
    {
      accessorKey: "jenis_layanan",
      header: "Jenis Layanan",
    },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
    },
    {
      accessorKey: "tanggal_permintaan",
      header: "Tanggal Permintaan",
    },
    {
      accessorKey: "tanggal_selesai",
      header: "Tanggal Selesai",
    },
    {
      accessorKey: "capaian",
      header: "Capaian",
    },
    {
      accessorKey: "petugas",
      header: "Petugas",
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

import React from "react";
import { BarChart3, BarChart4, ChartArea, ChartBar, Import, LayoutDashboard, Library } from "lucide-react";

export const Dashboard = React.lazy(() => import("../pages/dashboard"));
export const Login = React.lazy(() => import("../pages/login"));
export const LayananPerpustakaan = React.lazy(() => import("../pages/layanan-perpustakaan"));
export const RekomendasiStatistik = React.lazy(() => import("../pages/rekomendasi-statistik"));
export const KonsultasiStatistik = React.lazy(() => import("../pages/konsultasi-statistik"));
export const EkstraksiData = React.lazy(() => import("../pages/ekstraksi-data"));
export const RekapData = React.lazy(() => import("../pages/rekap-data"));
export const ProdukStatistik = React.lazy(() => import("../pages/produk-statistik"));

export const SIDEBAR_NAV = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Produk Layanan",
    items: [
      {
        label: "Pelayanan Perpustakaan",
        url: "/layanan-perpustakaan",
        icon: Library,
      },
      {
        label: "Konsultasi Statistik",
        url: "/konsultasi-statistik",
        icon: BarChart3,
      },
      {
        label: "Penjualan Produk Statistik Berbayar",
        url: "/produk-statistik",
        icon: ChartArea,
      },
      {
        label: "Pelayanan Rekomendasi Kegiatan Statistik",
        url: "/rekomendasi-statistik",
        icon: ChartBar,
      },
    ],
  },
  {
    title: "Data Rekapan",
    items: [
      {
        label: "Rekap Data",
        url: "/rekap-data",
        icon: BarChart4,
      },
    ],
  },
  {
    title: "Utilitas Sistem",
    items: [
      {
        label: "Ekstraksi Data",
        url: "/ekstraksi-data",
        icon: Import,
      },
    ],
  },
];

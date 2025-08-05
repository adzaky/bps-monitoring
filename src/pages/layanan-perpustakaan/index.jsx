"use client";

import React from "react";
import { useLoaderData } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Users, GraduationCap } from "lucide-react";
import LibraryServiceTable from "@/components/LibraryServiceTable";

export default function LibraryService() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterMedia, setFilterMedia] = React.useState("all");
  const [filterEducation, setFilterEducation] = React.useState("all");

  const { libraryServiceData } = useLoaderData();
  const filteredData = libraryServiceData
    .filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.job.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMedia = filterMedia === "all" || record.service_media === filterMedia;
      const matchesEducation = filterEducation === "all" || record.education === filterEducation;

      return matchesSearch && matchesMedia && matchesEducation;
    })
    .sort((a, b) => (new Date(b.visit_date_time) < new Date(a.visit_date_time) ? -1 : 1));

  // Statistik
  const totalVisitors = libraryServiceData.length;
  const digitalUsers = libraryServiceData.filter((r) => r.service_media === "Digilib").length;
  const printUsers = libraryServiceData.filter((r) => r.service_media === "Tercetak").length;
  const studentsCount = libraryServiceData.filter((r) => r.job === "Pelajar/Mahasiswa").length;

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Pelayanan Perpustakaan</h1>
        <p className="text-muted-foreground">Kelola dan pantau data pengunjung dan layanan perpustakaan</p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalVisitors}</p>
                <p className="text-muted-foreground text-sm">Total Pengunjung</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{digitalUsers}</p>
                <p className="text-muted-foreground text-sm">Pengguna Digital</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{printUsers}</p>
                <p className="text-muted-foreground text-sm">Pengguna Tercetak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{studentsCount}</p>
                <p className="text-muted-foreground text-sm">Pelajar/Mahasiswa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelayanan Perpustakaan</CardTitle>
          <CardDescription>Data pengunjung dan layanan yang digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter dan Search */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  placeholder="Cari nama, email, atau pekerjaan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterMedia} onValueChange={setFilterMedia}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Media" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Media</SelectItem>
                <SelectItem value="Tercetak">Tercetak</SelectItem>
                <SelectItem value="Digilib">Digital</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterEducation} onValueChange={setFilterEducation}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Pendidikan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pendidikan</SelectItem>
                <SelectItem value="<= SLTA">≤ SLTA</SelectItem>
                <SelectItem value="S1">S1</SelectItem>
                <SelectItem value="S2">S2</SelectItem>
                <SelectItem value="S3">S3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabel Data */}
          <LibraryServiceTable data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Users, UserPlus, Trash2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  tier: string;
}

export default function TeamManagement() {
  const { user, tier } = useUser();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user || tier !== "bisnis" || user.role !== "owner") return;

    const fetchMembers = async () => {
      try {
        const q = query(collection(db, "users"), where("parentUserId", "==", user.uid));
        const snapshot = await getDocs(q);
        const fetchedMembers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TeamMember[];
        setMembers(fetchedMembers);
      } catch (error) {
        console.error("Error fetching team members:", error);
        toast.error("Gagal memuat data tim");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [user, tier]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const response = await fetch("/api/team/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, password, name,
          parentUserId: user?.uid,
          tier: "bisnis"
        })
      });

      const data = await response.json();
      if (data.success) {
        setMembers([...members, {
          id: data.uid, name, email,
          role: "member", tier: "bisnis"
        }]);
        setShowAddForm(false);
        setName(""); setEmail(""); setPassword("");
        toast.success("Staf berhasil ditambahkan", {
          description: `${name} (${email}) kini bisa mengakses dashboard.`,
        });
      } else {
        toast.error("Gagal menambahkan staf", { description: data.message });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan jaringan";
      console.error(error);
      toast.error("Error", { description: message });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {

    try {
      const response = await fetch("/api/team/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, parentUserId: user?.uid })
      });

      const data = await response.json();
      if (data.success) {
        setMembers(members.filter(m => m.id !== memberId));
        toast.success("Staf dihapus", {
          description: `${memberName} telah dihapus dari tim.`,
        });
      } else {
        toast.error("Gagal menghapus staf", { description: data.message });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan jaringan";
      console.error(error);
      toast.error("Error", { description: message });
    }
  };

  if (!user || tier !== "bisnis" || user.role !== "owner") {
    return null;
  }

  return (
    <Card className="mb-8 overflow-hidden border-amber-200/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base">Manajemen Tim (Juragan Bisnis)</CardTitle>
            <CardDescription>Kelola akses staf ke dashboard perusahaan (Limit: {members.length}/5)</CardDescription>
          </div>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={members.length >= 5}
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Tambah Staf
        </Button>
      </CardHeader>

      {showAddForm && (
        <>
          <Separator />
          <form onSubmit={handleAddMember} className="p-6 bg-amber-50/50">
            <h4 className="font-bold text-sm text-foreground mb-4">Buat Akun Staf Baru</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Nama Staf</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                  placeholder="Budi Santoso" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Email Akun</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                  placeholder="budi@perusahaan.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Password Sementara</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                  placeholder="Minimal 6 karakter" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="cursor-pointer">
                Batal
              </Button>
              <Button type="submit" disabled={adding || members.length >= 5}
                className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                {adding ? "Menyimpan..." : "Simpan Akun Staf"}
              </Button>
            </div>
          </form>
        </>
      )}

      <Separator />
      <CardContent className="pt-6">
        {loading ? (
          <p className="text-center text-sm text-muted-foreground py-4">Memuat data tim...</p>
        ) : members.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Belum Ada Staf</p>
            <p className="text-xs text-muted-foreground">Anda dapat mendaftarkan hingga 5 staf untuk mengakses dashboard.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50 transition-colors hover:bg-muted">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center font-bold text-muted-foreground">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{member.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" /> {member.email}
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase border-amber-200 text-amber-700 bg-amber-50">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9"
                    title="Hapus Staf"
                    render={<button />}
                  >
                    <Trash2 className="w-4 h-4" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Akun Staf?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus staf <strong>{member.name}</strong>? Akses mereka ke dashboard akan dicabut secara permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
                      >
                        Ya, Hapus Staf
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

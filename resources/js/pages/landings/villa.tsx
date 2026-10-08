// Landing page VILLA TROPIS, villa di Canggu, Bali.
// Self-contained: tidak memakai AuthenticatedLayout, tidak menerima props.
// Header/nav + footer inline.
import { useMemo, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import { StatCounter } from '@/components/stat-counter';
import {
    BedDouble,
    CalendarCheck,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CookingPot,
    Flame,
    MapPin,
    Menu,
    Palmtree,
    Phone,
    ShowerHead,
    Sparkles,
    Users,
    Waves,
    Wifi,
    X,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia.
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

interface Villa {
    nama: string;
    tarif: number;
    kamar: number;
    kapasitas: string;
    foto: string;
    highlight: string[];
    unggulan?: boolean;
}

const VILLAS: Villa[] = [
    {
        nama: 'Villa Palm',
        tarif: 750000,
        kamar: 2,
        kapasitas: 'Maks 4 orang',
        foto: '/images/landing-villa/galeri-pool.jpg',
        highlight: ['Kolam renang pribadi 4x8 m', 'Dapur lengkap + ruang makan', 'Taman tropis 300 m²'],
    },
    {
        nama: 'Villa Bambu',
        tarif: 1100000,
        kamar: 3,
        kapasitas: 'Maks 6 orang',
        foto: '/images/landing-villa/galeri-bbq.jpg',
        highlight: ['Kolam infinity menghadap sawah', 'Gazebo + area BBQ', 'Bathtub outdoor'],
        unggulan: true,
    },
    {
        nama: 'Villa Infinity',
        tarif: 1800000,
        kamar: 4,
        kapasitas: 'Maks 10 orang',
        foto: '/images/landing-villa/galeri-sunset.jpg',
        highlight: ['Infinity pool 5x12 m', 'Home theater & karaoke', 'Chef on-call tersedia'],
    },
];

const FASILITAS: { nama: string; icon: LucideIcon }[] = [
    { nama: 'Kolam renang pribadi', icon: Waves },
    { nama: 'WiFi 200 Mbps', icon: Wifi },
    { nama: 'Dapur lengkap', icon: CookingPot },
    { nama: 'Area BBQ & gazebo', icon: Flame },
    { nama: 'Kamar mandi + water heater', icon: ShowerHead },
    { nama: 'Taman tropis asri', icon: Palmtree },
    { nama: 'Cocok untuk grup & keluarga', icon: Users },
    { nama: 'Daily cleaning', icon: Sparkles },
];

const GALERI = [
    { judul: 'Infinity pool Villa Bambu', foto: '/images/landing-villa/galeri-pool.jpg', anotasi: 'Air hangat, buka s.d. 22.00' },
    { judul: 'Kamar utama Villa Infinity', foto: '/images/landing-villa/galeri-kamar.jpg', anotasi: 'Kasur king + AC 2 unit' },
    { judul: 'Taman tropis Villa Palm', foto: '/images/landing-villa/galeri-taman.jpg', anotasi: '300 m², bebas asap rokok' },
    { judul: 'Area BBQ & gazebo', foto: '/images/landing-villa/galeri-bbq.jpg', anotasi: 'Arang & alat disediakan' },
    { judul: 'Sunset dari rooftop', foto: '/images/landing-villa/galeri-sunset.jpg', anotasi: 'Momen terbaik 17.30–18.00' },
];

// Tanggal yang sudah terisi (simulasi ketersediaan bulan berjalan).
const TANGGAL_TERISI = new Set([3, 4, 9, 10, 11, 17, 18, 24, 25]);

function namaBulan(idx: number) {
    return ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][idx];
}

export default function VillaLanding() {
    const [menuBuka, setMenuBuka] = useState(false);

    // Kalender ketersediaan: navigasi bulan.
    const sekarang = useMemo(() => new Date(), []);
    const [bulanOffset, setBulanOffset] = useState(0);
    const kalender = useMemo(() => {
        const ref = new Date(sekarang.getFullYear(), sekarang.getMonth() + bulanOffset, 1);
        const tahun = ref.getFullYear();
        const bulan = ref.getMonth();
        const hariPertama = new Date(tahun, bulan, 1).getDay(); // 0 = Minggu
        const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();
        const hariIniNum = sekarang.getDate();
        const bulanIni = bulanOffset === 0;
        return { tahun, bulan, hariPertama, jumlahHari, hariIniNum, bulanIni };
    }, [bulanOffset, sekarang]);

    // Form reservasi.
    const [nama, setNama] = useState('');
    const [villa, setVilla] = useState('');
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [tamu, setTamu] = useState('2');
    const [reservasiOk, setReservasiOk] = useState(false);

    const hariIni = useMemo(() => {
        const d = new Date();
        const bln = String(d.getMonth() + 1).padStart(2, '0');
        const tgl = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${bln}-${tgl}`;
    }, []);

    // Estimasi total: tarif x jumlah malam.
    const estimasi = useMemo(() => {
        const v = VILLAS.find((x) => x.nama === villa);
        if (!v || !checkin || !checkout) return null;
        const malam = Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000);
        if (malam <= 0) return null;
        return { malam, total: malam * v.tarif };
    }, [villa, checkin, checkout]);

    function kirimReservasi(e: FormEvent) {
        e.preventDefault();
        if (!nama.trim() || !villa || !checkin || !checkout) return;
        setReservasiOk(true);
    }

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#villa', label: 'Tipe Villa' },
        { href: '#galeri', label: 'Galeri' },
        { href: '#kalender', label: 'Ketersediaan' },
        { href: '#reservasi', label: 'Reservasi' },
        { href: '#lokasi', label: 'Lokasi' },
    ];

    return (
        <div className="min-h-screen bg-emerald-50/50 pb-24 text-stone-900 md:pb-0">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700">
                            <Palmtree className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-lg font-extrabold tracking-tight sm:text-xl">
                            VILLA <span className="text-emerald-700">TROPIS</span>
                        </span>
                    </a>
                    <nav className="ml-8 hidden items-center gap-1 lg:flex">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-emerald-900/5 hover:text-stone-900">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <Button className="ml-auto hidden bg-emerald-700 hover:bg-emerald-800 sm:inline-flex" asChild>
                        <a href="#reservasi">Reservasi</a>
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                        {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
                {menuBuka && (
                    <nav className="border-t border-emerald-900/10 px-4 py-2 lg:hidden">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} onClick={() => setMenuBuka(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-emerald-900/5">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero */}
            <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,.12) 0, transparent 40%)' }} aria-hidden />
                <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-4 bg-white/15 text-white hover:bg-white/20">Villa Private Pool • Canggu, Bali</Badge>
                        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Private Pool, <span className="text-lime-300">10 Menit ke Pantai.</span>
                        </h1>
                        <p className="mt-4 max-w-md text-emerald-100/90">
                            Tiga villa dengan kolam renang pribadi di Canggu, mulai Rp750rb/malam,
                            sudah termasuk sarapan dan daily cleaning. Check-in fleksibel dari jam 13.00.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50" asChild>
                                <a href="#villa">Lihat Tipe Villa</a>
                            </Button>
                            <a href="#kalender" className="text-sm font-semibold text-lime-100 underline-offset-4 hover:underline">
                                atau cek ketersediaan dulu →
                            </a>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-emerald-100/90">
                            <span className="flex items-center gap-1.5"><Waves className="h-4 w-4" /> Private pool</span>
                            <span className="flex items-center gap-1.5"><Wifi className="h-4 w-4" /> WiFi 200 Mbps</span>
                            <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Daily cleaning</span>
                        </div>
                    </div>
                    <div className="relative mx-auto hidden w-full max-w-md sm:block" aria-hidden>
                        <img src="/images/landing-villa/hero.jpg" alt="" className="h-72 w-full rounded-3xl object-cover shadow-2xl lg:h-96" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-emerald-950/40 to-transparent" />
                        <div className="absolute top-4 left-4 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-emerald-800 shadow-lg">Mulai Rp750rb/mlm</div>
                        <div className="absolute right-4 bottom-4 rounded-2xl bg-teal-950 px-4 py-2 text-xs font-semibold text-emerald-100 shadow-lg">10 mnt ke Pantai</div>
                    </div>
                </div>
            </section>

            {/* Statistik */}
            <section className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        { label: 'Tamu per tahun', value: 2800, suffix: '+' },
                        { label: 'Rating Google', value: 49, suffix: '/50', display: '4.9' },
                        { label: 'Tingkat hunian', value: 82, suffix: '%' },
                        { label: 'Tamu kembali lagi', value: 64, suffix: '%' },
                    ].map((s) => (
                        <Card key={s.label} className="text-center">
                            <CardContent className="p-5">
                                {s.display ? (
                                    <p className="text-3xl font-extrabold text-emerald-700">{s.display}</p>
                                ) : (
                                    <StatCounter value={s.value} suffix={s.suffix} className="text-3xl font-extrabold text-emerald-700" />
                                )}
                                <p className="mt-1 text-sm text-stone-600">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Tipe villa */}
            <section id="villa" className="mx-auto max-w-6xl px-4 py-10">
                <div className="text-center">
                    <Badge variant="outline" className="border-emerald-700/30 text-emerald-700">Tipe Villa</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Pilih Villa Favoritmu</h2>
                    <p className="mx-auto mt-2 max-w-lg text-stone-600">Tarif per malam, sudah termasuk sarapan untuk 2 orang dan daily cleaning.</p>
                </div>
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                    {VILLAS.map((v) => (
                        <Card key={v.nama} className={cn('relative overflow-hidden transition-shadow hover:shadow-lg', v.unggulan && 'border-2 border-emerald-600 shadow-md')}>
                            {v.unggulan && (
                                <Badge className="absolute top-3 right-3 z-10 bg-emerald-600 hover:bg-emerald-600">Paling sering dipesan</Badge>
                            )}
                            <div className="relative h-44 overflow-hidden">
                                <img src={v.foto} alt={v.nama} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden />
                                <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
                                    <BedDouble className="h-3.5 w-3.5" /> {v.kamar} kamar • {v.kapasitas}
                                </span>
                            </div>
                            <CardContent className="p-5">
                                <p className="font-extrabold">{v.nama}</p>
                                <p className="mt-1">
                                    <span className="text-2xl font-extrabold text-emerald-700">{rupiah(v.tarif)}</span>
                                    <span className="text-sm text-stone-500">/malam</span>
                                </p>
                                <ul className="mt-3 space-y-1.5 text-sm text-stone-600">
                                    {v.highlight.map((h) => (
                                        <li key={h} className="flex items-start gap-1.5">
                                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-700" /> {h}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800" onClick={() => { setVilla(v.nama); document.getElementById('reservasi')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                    Reservasi {v.nama}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Fasilitas */}
            <section className="bg-white py-14">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <Badge variant="outline" className="border-emerald-700/30 text-emerald-700">Fasilitas</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Semua Villa Dilengkapi</h2>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {FASILITAS.map((f) => (
                            <div key={f.nama} className="flex items-center gap-3 rounded-xl border p-4">
                                <f.icon className="h-6 w-6 shrink-0 text-emerald-700" strokeWidth={1.75} />
                                <p className="text-sm font-medium">{f.nama}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Galeri */}
            <section id="galeri" className="bg-stone-950 py-14 text-white">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Galeri Villa Tropis</h2>
                    <p className="mt-1 text-sm text-stone-400">Sudut-sudut favorit para tamu kami.</p>
                    <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                        {GALERI.map((g) => (
                            <div key={g.judul} className="w-60 shrink-0 overflow-hidden rounded-xl sm:w-72">
                                <div className="relative">
                                    <img src={g.foto} alt={g.judul} className="h-40 w-full object-cover sm:h-48" loading="lazy" />
                                    <span className="absolute top-2 left-2 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                                        {g.anotasi}
                                    </span>
                                </div>
                                <p className="bg-stone-900 px-3 py-2.5 text-sm font-medium text-stone-200">{g.judul}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Kalender ketersediaan */}
            <section id="kalender" className="mx-auto max-w-6xl px-4 py-14">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <div>
                        <Badge variant="outline" className="border-emerald-700/30 text-emerald-700">Ketersediaan</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Kalender Villa Palm</h2>
                        <p className="mt-2 text-stone-600">
                            Hijau berarti tersedia, abu-abu berarti sudah terisi. Kalender diperbarui setiap hari,
                            untuk kepastian tanggal spesifik, hubungi kami via WhatsApp.
                        </p>
                        <div className="mt-5 flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-500" /> Tersedia</span>
                            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-stone-300" /> Terisi</span>
                        </div>
                    </div>
                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" size="icon" disabled={bulanOffset <= 0} onClick={() => setBulanOffset((o) => o - 1)} aria-label="Bulan sebelumnya">
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <p className="font-extrabold">{namaBulan(kalender.bulan)} {kalender.tahun}</p>
                                <Button variant="ghost" size="icon" disabled={bulanOffset >= 3} onClick={() => setBulanOffset((o) => o + 1)} aria-label="Bulan berikutnya">
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-500">
                                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((h) => (
                                    <span key={h} className="py-1">{h}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                {Array.from({ length: kalender.hariPertama }).map((_, i) => (
                                    <span key={`kosong-${i}`} />
                                ))}
                                {Array.from({ length: kalender.jumlahHari }).map((_, i) => {
                                    const tgl = i + 1;
                                    const terisi = kalender.bulanIni && TANGGAL_TERISI.has(tgl);
                                    const hariIniCell = kalender.bulanIni && tgl === kalender.hariIniNum;
                                    return (
                                        <span
                                            key={tgl}
                                            className={cn(
                                                'flex h-9 items-center justify-center rounded-lg font-medium',
                                                terisi ? 'bg-stone-200 text-stone-400 line-through' : 'bg-emerald-100 text-emerald-800',
                                                hariIniCell && 'ring-2 ring-emerald-700',
                                            )}
                                        >
                                            {tgl}
                                        </span>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Form reservasi */}
            <section id="reservasi" className="mx-auto max-w-6xl px-4 pb-14">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <div>
                        <Badge variant="outline" className="border-emerald-700/30 text-emerald-700">Reservasi</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Amankan Tanggal Liburanmu</h2>
                        <p className="mt-2 text-stone-600">
                            DP 50% untuk mengunci tanggal, pelunasan maksimal H-7 sebelum check-in.
                            Pembatalan H-14 mendapat refund 100% DP.
                        </p>
                        <ul className="mt-5 space-y-3 text-sm text-stone-700">
                            {['Check-in 14.00 • Check-out 12.00', 'Sarapan untuk 2 orang sudah termasuk', 'Extra bed Rp150rb/malam'].map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /> {x}
                                </li>
                            ))}
                        </ul>
                        <figure className="mt-6 rounded-2xl border-l-4 border-emerald-600 bg-white p-4 shadow-sm">
                            <blockquote className="text-sm italic text-stone-700">
                                “Sewa Villa Bambu 3 malam buat keluarga 6 orang. Anak-anak nggak mau pulang,
                                pool-nya bersih, sarapannya enak, staff-nya ramah.”
                            </blockquote>
                            <figcaption className="mt-2 text-xs font-semibold text-stone-500">
                                Keluarga Wijaya, menginap 12–15 Juni 2026
                            </figcaption>
                        </figure>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-emerald-700" /> Form Reservasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reservasiOk ? (
                                <div className="rounded-xl bg-green-50 p-6 text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                    <p className="mt-3 text-lg font-bold text-green-800">Reservasi diterima!</p>
                                    <p className="mt-1 text-sm text-green-700">
                                        Terima kasih, <span className="font-semibold">{nama}</span>. {villa} untuk {tamu} orang,
                                        {checkin} s.d. {checkout} sudah kami catat.
                                        {estimasi && <> Estimasi total: <span className="font-bold">{rupiah(estimasi.total)}</span> ({estimasi.malam} malam).</>}
                                        Instruksi DP dikirim via WhatsApp.
                                    </p>
                                    <Button variant="outline" className="mt-4" onClick={() => { setReservasiOk(false); setNama(''); setVilla(''); setCheckin(''); setCheckout(''); setTamu('2'); }}>
                                        Buat reservasi lain
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={kirimReservasi} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="rv-nama">Nama</Label>
                                        <Input id="rv-nama" placeholder="cth: Andini Putri" value={nama} onChange={(e) => setNama(e.target.value)} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="rv-villa">Tipe villa</Label>
                                        <Select value={villa} onValueChange={setVilla} required>
                                            <SelectTrigger id="rv-villa"><SelectValue placeholder="Pilih villa" /></SelectTrigger>
                                            <SelectContent>
                                                {VILLAS.map((v) => (
                                                    <SelectItem key={v.nama} value={v.nama}>{v.nama}, {rupiah(v.tarif)}/malam</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="rv-in">Check-in</Label>
                                            <Input id="rv-in" type="date" min={hariIni} value={checkin} onChange={(e) => setCheckin(e.target.value)} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="rv-out">Check-out</Label>
                                            <Input id="rv-out" type="date" min={checkin || hariIni} value={checkout} onChange={(e) => setCheckout(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="rv-tamu">Jumlah tamu</Label>
                                        <Select value={tamu} onValueChange={setTamu}>
                                            <SelectTrigger id="rv-tamu"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {['1', '2', '3', '4', '5', '6', '7', '8+'].map((n) => (
                                                    <SelectItem key={n} value={n}>{n} orang</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {estimasi && (
                                        <div className="rounded-xl bg-emerald-50 p-4 text-sm">
                                            <div className="flex justify-between"><span className="text-stone-600">{estimasi.malam} malam x {rupiah(VILLAS.find((x) => x.nama === villa)?.tarif ?? 0)}</span></div>
                                            <div className="mt-1 flex justify-between"><span className="font-semibold">Estimasi total</span><span className="text-lg font-extrabold text-emerald-700">{rupiah(estimasi.total)}</span></div>
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800">Kirim Reservasi</Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Lokasi */}
            <section id="lokasi" className="mx-auto max-w-6xl px-4 pb-16">
                <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="relative min-h-64 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100" aria-hidden>
                            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(20,120,100,.08) 0 2px, transparent 2px 40px), repeating-linear-gradient(90deg, rgba(20,120,100,.08) 0 2px, transparent 2px 40px)' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="relative mx-auto flex h-14 w-14 items-center justify-center">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-40" />
                                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 shadow-lg">
                                        <MapPin className="h-7 w-7 text-white" />
                                    </span>
                                </span>
                                <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold shadow">VILLA TROPIS</p>
                            </div>
                        </div>
                        <CardContent className="p-6 sm:p-8">
                            <h2 className="text-2xl font-extrabold tracking-tight">Lokasi</h2>
                            <div className="mt-4 space-y-3 text-sm text-stone-700">
                                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /> Jl. Pantai Batu Bolong No. 88, Canggu, Kuta Utara, Badung, Bali 80361</p>
                                <ul className="space-y-1.5 pl-6">
                                    <li>• 10 menit ke Pantai Batu Bolong</li>
                                    <li>• 5 menit ke pusat kuliner Canggu</li>
                                    <li>• 45 menit dari Bandara Ngurah Rai</li>
                                </ul>
                                <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-emerald-700" /> 0812-3456-0011 (reservasi)</p>
                            </div>
                            <Button size="lg" className="mt-6 w-full bg-green-600 hover:bg-green-700 sm:w-auto" asChild>
                                <a href="https://wa.me/6281234560011?text=Halo%20Villa%20Tropis!%20Saya%20ingin%20bertanya%20ketersediaan%20villa." target="_blank" rel="noreferrer">
                                    Chat WhatsApp
                                </a>
                            </Button>
                        </CardContent>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="bg-teal-950 text-teal-200/80">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700">
                                <Palmtree className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-lg font-extrabold text-white">VILLA <span className="text-emerald-400">TROPIS</span></span>
                        </div>
                        <p className="mt-3 text-sm">Villa private pool di Canggu, Bali. Liburan tropis dengan privasi penuh.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Tarif per Malam</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Villa Palm, Rp750rb</li>
                            <li>Villa Bambu, Rp1,1jt</li>
                            <li>Villa Infinity, Rp1,8jt</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Kontak</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Jl. Pantai Batu Bolong No. 88, Canggu</li>
                            <li>0812-3456-0011</li>
                            <li>Check-in 14.00 • Check-out 12.00</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-teal-900 py-4 text-center text-xs">© 2026 Villa Tropis, Bali.</div>
            </footer>

            <StickyMobileCta
                variant="whatsapp"
                title="Villa Tropis"
                subtitle="Mulai Rp750rb/malam • private pool"
                actionLabel="Reservasi"
            />
        </div>
    );
}

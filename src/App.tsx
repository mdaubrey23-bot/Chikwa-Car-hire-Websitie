/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car as CarIcon, 
  Users, 
  Plane, 
  Bus, 
  User, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  DollarSign, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  ChevronRight,
  Briefcase,
  Settings,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  CreditCard,
  Printer,
  X,
  Menu,
  Search,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addDays, differenceInDays } from 'date-fns';
import { Page, Car, QuoteData, InvoiceData, ReceiptData } from './types';
import { COMPANY_DETAILS, SERVICES, WHY_CHOOSE_US, TESTIMONIALS, FLEET, BRAND_STORY } from './constants';
import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';

// --- Components ---

const WhatsAppButton = () => (
  <a 
    href={`https://wa.me/${COMPANY_DETAILS.phone.replace(/\D/g, '')}`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
    title="Chat on WhatsApp"
  >
    <div className="absolute -top-12 right-0 bg-white text-brand-blue px-3 py-1 rounded-lg text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Chat with us!
    </div>
    <MessageCircle size={28} />
  </a>
);

const AdminDashboard = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'fleet' | 'quotes'>('fleet');
  const [newCar, setNewCar] = useState<Partial<Car>>({
    name: '',
    category: 'Economy',
    passengers: 5,
    luggage: 2,
    transmission: 'Automatic',
    pricePerDay: 800,
    image: '',
  });

  useEffect(() => {
    const carsQ = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
    const unsubCars = onSnapshot(carsQ, (snapshot) => {
      setCars(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car)));
    });

    const quotesQ = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
    const unsubQuotes = onSnapshot(quotesQ, (snapshot) => {
      setQuotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubCars();
      unsubQuotes();
    };
  }, []);

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.name || !newCar.image) return;
    try {
      await addDoc(collection(db, 'cars'), {
        ...newCar,
        createdAt: serverTimestamp(),
      });
      setNewCar({ name: '', category: 'Economy', passengers: 5, luggage: 2, transmission: 'Automatic', pricePerDay: 800, image: '' });
    } catch (error) { console.error(error); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <h2 className="text-4xl font-display font-black text-brand-blue uppercase">Owner Dashboard</h2>
        <div className="flex bg-zinc-100 p-1 rounded-xl no-print">
          <button 
            onClick={() => setActiveTab('fleet')}
            className={`px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'fleet' ? 'bg-brand-blue text-white shadow-lg' : 'text-zinc-500'}`}
          >
            Fleet Manager
          </button>
          <button 
            onClick={() => setActiveTab('quotes')}
            className={`px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'quotes' ? 'bg-brand-blue text-white shadow-lg' : 'text-zinc-500'}`}
          >
            Quotes ({quotes.length})
          </button>
          <button 
            onClick={() => signOut(auth)}
            className="px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all ml-2"
          >
            Logout
          </button>
        </div>
      </div>
      
      {activeTab === 'fleet' ? (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 sticky top-32">
              <h3 className="text-xl font-display font-bold text-brand-blue mb-6">Add New Vehicle</h3>
              <form onSubmit={handleAddCar} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">Vehicle Name</label>
                  <input placeholder="e.g. Toyota Land Cruiser" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-orange outline-none" value={newCar.name} onChange={e => setNewCar({...newCar, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">Category</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-zinc-200" value={newCar.category} onChange={e => setNewCar({...newCar, category: e.target.value as any})}>
                    <option value="Economy">Economy</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">Pax</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-zinc-200" value={newCar.passengers} onChange={e => setNewCar({...newCar, passengers: parseInt(e.target.value)})} />
                  </div>
                  <div className="w-1/2 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">Bags</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-zinc-200" value={newCar.luggage} onChange={e => setNewCar({...newCar, luggage: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">Daily Rate (ZMW)</label>
                  <input type="number" className="w-full px-4 py-3 rounded-xl border border-zinc-200" value={newCar.pricePerDay} onChange={e => setNewCar({...newCar, pricePerDay: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">Image URL</label>
                  <input placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-zinc-200" value={newCar.image} onChange={e => setNewCar({...newCar, image: e.target.value})} />
                </div>
                <button className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-orange transition-colors shadow-lg shadow-brand-blue/20">Save Vehicle</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-6">
              {cars.map(car => (
                <div key={car.id} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow group">
                  <img src={car.image} className="w-24 h-24 object-cover rounded-xl" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-brand-blue">{car.name}</h4>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">{car.category} • ZMW {car.pricePerDay}</p>
                  </div>
                  <button onClick={() => deleteDoc(doc(db, 'cars', car.id))} className="text-zinc-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100">
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {quotes.map(q => (
            <div key={q.id} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono font-bold text-brand-orange bg-brand-orange/5 px-4 py-1.5 rounded-full border border-brand-orange/10">{q.reference}</span>
                    <span className="text-xs text-zinc-400 font-medium">{format(q.createdAt?.toDate() || new Date(), 'PPP p')}</span>
                  </div>
                  <h4 className="text-2xl font-display font-black text-brand-blue mb-4">{q.customerName}</h4>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="flex items-center gap-3 text-sm text-zinc-600 font-medium bg-zinc-50 p-2 rounded-lg border border-zinc-100"><Phone size={16} className="text-brand-orange" /> {q.phone}</p>
                      <p className="flex items-center gap-3 text-sm text-zinc-600 font-medium bg-zinc-50 p-2 rounded-lg border border-zinc-100"><Mail size={16} className="text-brand-orange" /> {q.email}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Rental Route</p>
                       <p className="text-sm font-semibold text-zinc-700">{q.pickupLocation} → {q.dropoffLocation}</p>
                       <p className="text-xs text-zinc-400">{q.durationDays} Days Duration</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end min-w-[200px]">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Quote Total</p>
                    <p className="text-3xl font-display font-black text-brand-blue">ZMW {q.total?.toLocaleString()}</p>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <CarIcon size={16} className="text-brand-orange" />
                      <span className="text-sm font-bold text-brand-blue">{q.car?.name}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteDoc(doc(db, 'quotes', q.id))}
                    className="text-zinc-300 hover:text-red-500 transition-colors mt-6 opacity-0 group-hover:opacity-100"
                  >
                    Delete Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
          {quotes.length === 0 && <div className="text-center py-24 bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
            <FileText size={48} className="mx-auto text-zinc-200 mb-4" />
            <p className="text-zinc-400 font-medium">No customer quotes found in the database.</p>
          </div>}
        </div>
      )}
    </div>
  );
};

const Navbar = ({ currentPage, onPageChange, user, onLogout }: { currentPage: Page, onPageChange: (p: Page) => void, user: FirebaseUser | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { label: 'Home', page: Page.HOME },
    { label: 'Fleet', page: Page.FLEET },
    { label: 'Get Quote', page: Page.QUOTE },
  ];

  navItems.push({ label: 'Admin', page: Page.ADMIN });

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand-blue/95 backdrop-blur-md text-white border-b border-brand-orange/20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onPageChange(Page.HOME)}>
            <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center mr-3">
              <CarIcon className="text-white" size={24} />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight leading-none block uppercase">Chikwa</span>
              <span className="text-[10px] text-brand-orange uppercase tracking-[0.2em] font-medium block">Car Hire Ltd</span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onPageChange(item.page)}
                className={`font-display text-sm uppercase tracking-widest font-medium transition-colors hover:text-brand-orange ${currentPage === item.page ? 'text-brand-orange' : 'text-gray-300'}`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => onPageChange(Page.QUOTE)}
              className="bg-brand-orange text-white px-6 py-2.5 rounded-full font-display text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-brand-blue transition-all shadow-lg hover:shadow-brand-orange/20 active:scale-95"
            >
              Get a Quote
            </button>
            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border-2 border-brand-orange" />
                <button
                  onClick={onLogout}
                  className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-orange transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-brand-blue border-b border-brand-gold/20 pb-6 px-4 space-y-4"
          >
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => { onPageChange(item.page); setIsOpen(false); }}
                className={`block w-full text-left font-display text-lg uppercase tracking-widest font-medium py-2 ${currentPage === item.page ? 'text-brand-gold' : 'text-gray-300'}`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onPageChange(Page.QUOTE); setIsOpen(false); }}
              className="w-full bg-brand-gold text-brand-blue py-3 rounded-xl font-display font-bold uppercase tracking-wider"
            >
              Get a Quote
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onGetQuote }: { onGetQuote: () => void }) => {
  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1629891823190-213197607a70?q=80&w=2669&auto=format&fit=crop" 
          alt="Luxury Land Cruiser 200 Hero"
          className="w-full h-full object-cover brightness-[0.3]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/60 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="text-brand-orange font-display font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Vehicle Hiring Experts</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-6">
            Zambia's Best <br />
            <span className="text-brand-orange">Service Provider.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light">
            Providing excellent and manageable services in car hire across Lusaka and Zambia. Experience the Chikwa standard of integrity and honesty.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={onGetQuote}
              className="bg-brand-orange text-white px-10 py-5 rounded-full font-display font-extrabold uppercase tracking-widest hover:bg-white hover:text-brand-blue transition-all shadow-2xl flex items-center justify-center group active:scale-95"
            >
              Get a Quote <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-white/30 text-white px-10 py-5 rounded-full font-display font-bold uppercase tracking-widest hover:bg-white hover:text-brand-blue transition-all active:scale-95">
              Explore Fleet
            </button>
          </div>
        </motion.div>
      </div>

      {/* Trust Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-white/5 backdrop-blur-md border-t border-white/10 py-6 overflow-hidden hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange whitespace-nowrap mr-12">Trusted by:</span>
          <div className="flex items-center space-x-16 overflow-hidden flex-1">
            {[...['ZAMBIA AIR FORCE', 'ZAMBIA ARMY', 'JICA', 'UNICEF', 'MINISTRY OF HEALTH'],
  ...['ZAMBIA AIR FORCE', 'ZAMBIA ARMY', 'JICA', 'UNICEF', 'MINISTRY OF HEALTH']].map((name, i) => (
  <span key={i} className="animate-marquee text-white/40 text-xs font-black tracking-widest whitespace-nowrap mx-10">{name}</span>
))}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 hidden lg:block"
      >
        <div className="w-64 h-64 border-2 border-brand-gold/10 rounded-full flex items-center justify-center">
          <div className="w-48 h-48 border border-brand-gold/20 rounded-full flex items-center justify-center">
            <div className="w-32 h-32 bg-brand-gold/5 rounded-full" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const ServicesSection = () => {
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Car': return <CarIcon size={32} />;
      case 'User': return <User size={32} />;
      case 'Plane': return <Plane size={32} />;
      case 'Bus': return <Bus size={32} />;
      default: return <CarIcon size={32} />;
    }
  };

  return (
    <section className="py-24 bg-zinc-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-brand-blue mb-4">Our Services</h2>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light">Comprehensive transportation solutions tailored to your specific needs in Zambia.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-xl hover:-translate-y-2 transition-all group"
            >
              <div className="w-16 h-16 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-gold mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                {getIcon(service.icon)}
              </div>
              <h3 className="text-xl font-display font-bold text-brand-blue mb-3">{service.title}</h3>
              <p className="text-gray-500 leading-relaxed font-light">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FleetGrid = ({ onBookCar }: { onBookCar: (car: Car) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [carsFromDb, setCarsFromDb] = useState<Car[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setCarsFromDb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car)));
    });
    return () => unsub();
  }, []);

  const allCars = [...FLEET, ...carsFromDb];
  const categories = ['All', 'Economy', 'SUV', 'Luxury', 'Van', 'Truck'];

  const filteredCars = allCars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-50 p-8 rounded-3xl border border-zinc-100 no-print">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search vehicle..." 
            className="w-full pl-12 pr-6 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-brand-orange bg-white shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === c ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-white text-zinc-400 border border-zinc-100 hover:border-brand-orange'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCars.map((car, index) => (
          <motion.div
            key={car.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-zinc-100 card-hover h-full flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 bg-brand-blue/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
                  {car.category}
                </div>
              </div>
              <div className="p-8 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-display font-black text-brand-blue uppercase leading-tight">{car.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-8 pb-8 border-b border-zinc-50">
                  <div className="flex items-center"><Users size={14} className="mr-2 text-brand-orange" /> {car.passengers} Pax</div>
                  <div className="flex items-center"><Briefcase size={14} className="mr-2 text-brand-orange" /> {car.luggage} Bags</div>
                  <div className="flex items-center"><Settings size={14} className="mr-2 text-brand-orange" /> {car.transmission}</div>
                  <div className="flex items-center"><ShieldCheck size={14} className="mr-2 text-brand-orange" /> Insured</div>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest block mb-1">Price/Day</span>
                    <span className="text-3xl font-display font-black text-brand-blue leading-none">ZMW {car.pricePerDay.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => onBookCar(car)}
                    className="bg-brand-orange text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-brand-blue transition-all shadow-lg shadow-brand-orange/20 active:scale-95 group/btn"
                  >
                    <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {filteredCars.length === 0 && (
        <div className="text-center py-32 bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
          <CarIcon size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-zinc-400 font-medium font-display uppercase tracking-widest">No vehicles found</p>
        </div>
      )}
    </div>
  );
};

const QuoteFormCard = ({ initialCar, onSubmit }: { initialCar?: Car, onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    pickupLocation: 'Lusaka International Airport (LUN)',
    dropoffLocation: 'Lusaka City Centre',
    pickupDateTime: format(addDays(new Date(), 1), "yyyy-MM-dd'T'10:00"),
    dropoffDateTime: format(addDays(new Date(), 3), "yyyy-MM-dd'T'10:00"),
    carId: initialCar?.id || FLEET[0].id,
    extraDriver: false,
    extraInsurance: false,
    extraChildSeat: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-zinc-100 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">Full Name</label>
            <input 
              required
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              type="text" 
              className="w-full bg-zinc-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-gold outline-none text-brand-blue font-medium shadow-inner" 
              placeholder="e.g. John Doe" 
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">Phone & Email</label>
            <div className="flex space-x-2">
              <input 
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel" 
                className="w-1/2 bg-zinc-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-gold outline-none text-brand-blue font-medium shadow-inner" 
                placeholder="+260..." 
              />
              <input 
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email" 
                className="w-1/2 bg-zinc-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-gold outline-none text-brand-blue font-medium shadow-inner" 
                placeholder="mail@example.com" 
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">Pick-up Location</label>
            <input 
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              type="text" 
              className="w-full bg-zinc-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-gold outline-none text-brand-blue font-medium shadow-inner" 
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">Drop-off Location</label>
            <input 
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              type="text" 
              className="w-full bg-zinc-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-gold outline-none text-brand-blue font-medium shadow-inner" 
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">Pick-up Date & Time</label>
            <input 
              required
              name="pickupDateTime"
              value={formData.pickupDateTime}
              onChange={handleChange}
              type="datetime-local" 
              className="w-full bg-zinc-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-gold outline-none text-brand-blue font-medium shadow-inner" 
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">Drop-off Date & Time</label>
            <input 
              required
              name="dropoffDateTime"
              value={formData.dropoffDateTime}
              onChange={handleChange}
              type="datetime-local" 
              className="w-full bg-zinc-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-gold outline-none text-brand-blue font-medium shadow-inner" 
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">Vehicle Type</label>
            <select 
              name="carId"
              value={formData.carId}
              onChange={handleChange}
              className="w-full bg-zinc-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-gold outline-none text-brand-blue font-bold shadow-inner accent-brand-gold"
            >
              {FLEET.map(car => (
                <option key={car.id} value={car.id}>{car.name} - ZMW {car.pricePerDay}/day</option>
              ))}
            </select>
          </div>
          <div className="space-y-4 flex flex-col justify-center">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Extra Options</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" name="extraDriver" checked={formData.extraDriver} onChange={handleChange} className="w-5 h-5 rounded border-zinc-300 text-brand-gold focus:ring-brand-gold" />
                <span className="text-sm font-medium text-brand-blue">Driver</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" name="extraInsurance" checked={formData.extraInsurance} onChange={handleChange} className="w-5 h-5 rounded border-zinc-300 text-brand-gold focus:ring-brand-gold" />
                <span className="text-sm font-medium text-brand-blue">Insurance</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" name="extraChildSeat" checked={formData.extraChildSeat} onChange={handleChange} className="w-5 h-5 rounded border-zinc-300 text-brand-gold focus:ring-brand-gold" />
                <span className="text-sm font-medium text-brand-blue">Child Seat</span>
              </label>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-brand-blue text-brand-gold py-6 rounded-2xl font-display font-extrabold uppercase tracking-[0.2em] text-xl shadow-xl hover:bg-brand-gold hover:text-brand-blue transition-all active:scale-[0.98]"
        >
          Generate Instant Quote
        </button>
      </form>
    </div>
  );
};

const QuoteResult = ({ quote, onConvert }: { quote: QuoteData, onConvert: () => void }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="quote-print-card relative mb-12">
        {/* Quote Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-10 border-b border-zinc-100">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center mr-2">
                <CarIcon size={16} className="text-brand-orange" />
              </div>
              <h2 className="text-2xl font-display font-black text-brand-blue uppercase tracking-tighter">Chikwa Quote</h2>
            </div>
            <p className="text-zinc-400 font-mono text-xs">REF: {quote.reference}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-1">Status: Valid</p>
            <p className="text-zinc-500 text-sm">Expires: {quote.validityDate}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Customer Details</h3>
            <div className="space-y-1">
              <p className="text-xl font-bold text-brand-blue">{quote.customerName}</p>
              <p className="text-zinc-500 font-medium">{quote.email}</p>
              <p className="text-zinc-500 font-medium">{quote.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Rental Logistics</h3>
            <div className="space-y-4">
              <div className="flex space-x-6">
                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-brand-gold shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-blue uppercase tracking-widest">Pick-up</p>
                  <p className="text-sm font-semibold text-zinc-600">{quote.pickupLocation}</p>
                  <p className="text-xs text-zinc-400">{format(new Date(quote.pickupDateTime), 'PPP p')}</p>
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 shrink-0">
                  <ChevronRight size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Drop-off</p>
                  <p className="text-sm font-semibold text-zinc-600">{quote.dropoffLocation}</p>
                  <p className="text-xs text-zinc-400">{format(new Date(quote.dropoffDateTime), 'PPP p')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Vehicle */}
        <div className="bg-brand-blue rounded-2xl p-6 flex items-center justify-between mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border border-white/10">
              <img src={quote.car.image} alt={quote.car.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-white font-display font-bold text-lg">{quote.car.name}</h4>
              <p className="text-brand-gold text-xs font-bold uppercase tracking-widest">{quote.car.category} • {quote.durationDays} Days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-mono text-lg">ZMW {quote.car.pricePerDay}</p>
            <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">per day</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4 mb-12 border-t border-zinc-100 pt-8">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Base Rental Fee</span>
            <span className="font-mono text-zinc-800">ZMW {quote.baseRate.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Add-ons & Extras</span>
            <span className="font-mono text-zinc-800">ZMW {quote.extrasCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-4 border-t border-zinc-50">
            <span className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Subtotal</span>
            <span className="font-mono text-zinc-800">ZMW {quote.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">VAT (16%)</span>
            <span className="font-mono text-zinc-800">ZMW {quote.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-6 text-2xl">
            <span className="text-brand-blue font-display font-black uppercase tracking-tighter">Total Quote</span>
            <span className="font-display font-black text-brand-gold border-b-4 border-brand-blue">ZMW {quote.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6 italic">Quote valid for 7 days until {quote.validityDate}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 no-print">
            <button 
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-2 bg-zinc-100 text-zinc-600 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-200"
            >
              <Printer size={16} /> <span>Print Quote</span>
            </button>
            <button 
              onClick={onConvert}
              className="flex items-center justify-center space-x-2 bg-brand-gold text-brand-blue px-10 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-brand-blue hover:text-white shadow-xl shadow-brand-gold/20"
            >
              <FileText size={18} /> <span>Convert to Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoiceResult = ({ invoice, onPay }: { invoice: InvoiceData, onPay: (method: ReceiptData['paymentMethod']) => void }) => {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="quote-print-card relative mb-12">
        {/* Letterhead */}
        <div className="flex justify-between items-start mb-16">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mr-4">
              <CarIcon className="text-brand-orange" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-black uppercase tracking-tight text-brand-blue">Chikwa</h1>
              <p className="text-[10px] text-brand-orange uppercase font-bold tracking-[0.3em]">Car Hire Limited</p>
            </div>
          </div>
          <div className="text-right text-[10px] uppercase font-bold tracking-widest text-zinc-400 space-y-1">
            <p>Lusaka, Zambia</p>
            <p>{COMPANY_DETAILS.phone}</p>
            <p>{COMPANY_DETAILS.email}</p>
            <p>VAT Reg: ZM-HUP-2024</p>
          </div>
        </div>

        {/* Invoice Title */}
        <div className="flex justify-between items-end mb-12 border-b border-zinc-100 pb-8">
          <div>
            <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-brand-blue">Invoice</h2>
            <p className="text-zinc-500 font-mono text-sm mt-2">#{invoice.invoiceNumber}</p>
          </div>
          <div className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs ${invoice.status === 'PAID' ? 'badge-paid' : 'badge-unpaid'}`}>
            {invoice.status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Billed To</h3>
            <div className="space-y-1">
              <p className="text-xl font-bold text-brand-blue">{invoice.customerName}</p>
              <p className="text-zinc-500 font-medium">{invoice.email}</p>
              <p className="text-zinc-500 font-medium">{invoice.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Details</h3>
            <div className="space-y-1">
              <p className="text-sm font-bold text-brand-blue">Date: <span className="text-zinc-500 font-medium">{format(new Date(invoice.createdAt), 'PP')}</span></p>
              <p className="text-sm font-bold text-brand-blue">Due: <span className="text-zinc-500 font-medium">{invoice.dueDate}</span></p>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="text-left border-b border-zinc-100">
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Description</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">Qty / Days</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Unit Price</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-zinc-50">
              <td className="py-6 font-bold text-brand-blue">
                Car Rental: {invoice.car.name}
                <p className="text-[10px] font-medium text-zinc-400 uppercase mt-1 italic">{invoice.car.category}</p>
              </td>
              <td className="py-6 text-center text-zinc-600 font-medium">{invoice.durationDays}</td>
              <td className="py-6 text-right text-zinc-600 font-mono">ZMW {invoice.car.pricePerDay.toFixed(2)}</td>
              <td className="py-6 text-right text-brand-blue font-bold font-mono">ZMW {invoice.baseRate.toFixed(2)}</td>
            </tr>
            {invoice.extras.driver && (
              <tr className="border-b border-zinc-50">
                <td className="py-4 font-medium text-zinc-600">Professional Chauffeur Service</td>
                <td className="py-4 text-center text-zinc-400 font-medium">1</td>
                <td className="py-4 text-right text-zinc-400 font-mono">included</td>
                <td className="py-4 text-right text-brand-blue font-mono">250.00</td>
              </tr>
            )}
            {/* ... simplified for example ... */}
            <tr className="border-b border-zinc-50">
              <td className="py-4 font-medium text-zinc-600">Additional Options & Insurance</td>
              <td className="py-4 text-center text-zinc-400 font-medium">1</td>
              <td className="py-4 text-right text-zinc-400 font-mono">add-on</td>
              <td className="py-4 text-right text-brand-blue font-mono">{(invoice.extrasCost - (invoice.extras.driver ? 250 : 0)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-full max-w-xs space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
              <span className="font-mono text-zinc-800 font-bold">ZMW {invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">VAT (16%)</span>
              <span className="font-mono text-zinc-800 font-bold">ZMW {invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-brand-blue/10">
              <span className="text-brand-blue font-display font-black uppercase tracking-tighter text-xl">Total Amount</span>
              <span className="font-display font-black text-2xl text-brand-gold">ZMW {invoice.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-zinc-50 p-6 rounded-2xl mb-12">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Payment Instructions</h4>
          <div className="grid grid-cols-2 gap-8 text-[10px] uppercase font-bold tracking-widest text-brand-blue">
            <div>
              <p className="text-zinc-400 mb-1">Bank Transfer:</p>
              <p>Chikwa Car Hire Limited</p>
              <p>Zambia National Commercial Bank</p>
              <p>Acc: 5543 XXXX XXXX</p>
            </div>
            <div>
              <p className="text-zinc-400 mb-1">Mobile Money:</p>
              <p>Airtel Money: 0978 XXX XXX</p>
              <p>MTN Money: 0968 XXX XXX</p>
              <p>Merchant Code: HUP88</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 no-print">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-2 bg-zinc-100 text-zinc-600 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-200"
          >
            <Download size={16} /> <span>Save as PDF</span>
          </button>
          {invoice.status === 'UNPAID' && (
            <button 
              onClick={() => setShowPayment(true)}
              className="flex items-center justify-center space-x-2 bg-brand-blue text-brand-gold px-10 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-brand-gold hover:text-brand-blue shadow-xl"
            >
              <CreditCard size={18} /> <span>Mark as Paid</span>
            </button>
          )}
        </div>
      </div>

      {/* Payment Selection Modal */}
      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-blue/80 backdrop-blur-sm"
              onClick={() => setShowPayment(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl"
            >
              <h3 className="text-2xl font-display font-bold text-brand-blue mb-2 text-center uppercase tracking-tight">Confirm Payment</h3>
              <p className="text-zinc-500 text-center mb-8 font-light">Select the payment method used by the customer.</p>
              <div className="space-y-4">
                {(['Cash', 'Mobile Money', 'Bank Transfer'] as const).map(method => (
                  <button 
                    key={method}
                    onClick={() => { onPay(method); setShowPayment(false); }}
                    className="w-full py-5 border-2 border-zinc-100 rounded-2xl font-display font-bold text-brand-blue hover:border-brand-gold hover:bg-brand-gold/5 transition-all flex items-center justify-between px-6 group"
                  >
                    <span>{method}</span>
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowPayment(false)}
                className="w-full mt-6 text-zinc-400 font-bold uppercase text-[10px] tracking-widest underline underline-offset-4"
              >
                Go back
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReceiptResult = ({ receipt }: { receipt: ReceiptData }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-12 lg:p-20 border-2 border-brand-gold/20 rounded-[3rem] shadow-2xl text-center relative overflow-hidden">
        {/* Background Stamp */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-12 pointer-events-none select-none">
          <CheckCircle2 size={600} className="text-brand-blue" />
        </div>

        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative z-10"
        >
          <div className="w-24 h-24 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-brand-gold/40">
            <CheckCircle2 className="text-brand-blue" size={48} />
          </div>
          
          <h1 className="text-5xl font-display font-black text-brand-blue uppercase tracking-tighter mb-4">Payment Receipt</h1>
          <p className="text-zinc-400 font-mono text-sm uppercase tracking-[0.3em] mb-12">#{receipt.receiptNumber}</p>
          
          <div className="max-w-md mx-auto space-y-8 mb-16">
            <div className="flex justify-between border-b border-zinc-100 pb-4">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Customer Name</span>
              <span className="text-brand-blue font-bold">{receipt.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 pb-4">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Payment Date</span>
              <span className="text-brand-blue font-bold">{receipt.paymentDate}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 pb-4">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Payment Method</span>
              <span className="text-brand-blue font-bold">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t-2 border-brand-orange/40 pt-6">
              <span className="text-brand-blue text-lg font-display font-black uppercase tracking-tight">Amount Paid</span>
              <span className="text-3xl font-display font-black text-brand-orange">ZMW {receipt.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-16">
            <p className="text-zinc-500 italic mb-8 font-light">"Thank you for choosing Chikwa Car Hire Limited. We hope you have a safe and wonderful journey."</p>
            <div className="relative inline-block px-12 py-4 border-2 border-brand-orange rounded-xl transform -rotate-2">
              <span className="text-brand-orange font-display font-black uppercase tracking-[0.2em] text-xl">PAID - CHIKWA</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 no-print">
            <button 
              onClick={() => window.print()}
              className="bg-brand-blue text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-brand-gold hover:text-brand-blue transition-all"
            >
              Download Receipt PDF
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-zinc-100 text-zinc-600 px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em]"
            >
              New Booking
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Admin Login Form ---

const ADMIN_USERNAME = 'chikwa';
const ADMIN_PASSWORD = 'Chikwa2024!';

const AdminLoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        onLogin();
      } else {
        setError('Incorrect username or password. Please try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="py-40 flex flex-col items-center justify-center px-4">
      <div className="bg-white border border-zinc-100 shadow-2xl rounded-3xl p-12 max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CarIcon size={36} className="text-brand-orange" />
          </div>
          <h2 className="text-3xl font-display font-black text-brand-blue uppercase tracking-tight mb-2">Owner Portal</h2>
          <p className="text-zinc-400 font-light text-sm">Enter your credentials to access the dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter username"
              className="w-full bg-zinc-50 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-brand-orange text-brand-blue font-medium border border-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                className="w-full bg-zinc-50 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-brand-orange text-brand-blue font-medium border border-zinc-100 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-blue transition-colors text-xs font-bold uppercase tracking-widest"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold px-4 py-3 rounded-xl uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-blue text-white py-5 rounded-2xl font-display font-bold uppercase tracking-widest hover:bg-brand-orange transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest mt-8 text-center">Authorised personnel only</p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedCarForQuote, setSelectedCarForQuote] = useState<Car | undefined>(undefined);
  const [currentQuote, setCurrentQuote] = useState<QuoteData | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [cars, setCars] = useState<Car[]>(FLEET);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const q = query(collection(db, 'cars'));
    const unsubscribeCars = onSnapshot(q, (snapshot) => {
      const carsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
      if (carsList.length > 0) {
        setCars(carsList);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCars();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const generateQuote = (formData: any) => {
    const car = cars.find(c => c.id === formData.carId) || cars[0];
    const days = Math.max(1, differenceInDays(new Date(formData.dropoffDateTime), new Date(formData.pickupDateTime)));
    
    // Simple cost calculation
    const baseRate = car.pricePerDay * days;
    let extrasCost = 0;
    if (formData.extraDriver) extrasCost += 250 * days;
    if (formData.extraInsurance) extrasCost += 150 * days;
    if (formData.extraChildSeat) extrasCost += 75 * days;

    const subtotal = baseRate + extrasCost;
    const tax = subtotal * COMPANY_DETAILS.vatRate;
    const total = subtotal + tax;

    const quote: QuoteData = {
      reference: `HU-${format(new Date(), 'yyyy')}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      pickupDateTime: formData.pickupDateTime,
      dropoffDateTime: formData.dropoffDateTime,
      car,
      extras: {
        driver: formData.extraDriver,
        insurance: formData.extraInsurance,
        childSeat: formData.extraChildSeat,
      },
      durationDays: days,
      baseRate,
      extrasCost,
      subtotal,
      tax,
      total,
      validityDate: format(addDays(new Date(), 7), 'PP'),
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    try {
      addDoc(collection(db, 'quotes'), {
        ...quote,
        createdAt: serverTimestamp(),
      });
    } catch (e) { console.error("Error saving quote:", e); }

    setCurrentQuote(quote);
    setCurrentPage(Page.QUOTE);
  };

  const convertToInvoice = () => {
    if (!currentQuote) return;
    const invoice: InvoiceData = {
      ...currentQuote,
      invoiceNumber: `INV-${format(new Date(), 'yyyyMM')}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      dueDate: format(addDays(new Date(), 3), 'PP'),
      status: 'UNPAID',
    };
    setCurrentInvoice(invoice);
    setCurrentPage(Page.INVOICE);
  };

  const markAsPaid = (method: ReceiptData['paymentMethod']) => {
    if (!currentInvoice) return;
    const receipt: ReceiptData = {
      ...currentInvoice,
      status: 'PAID' as const,
      receiptNumber: `RCP-${format(new Date(), 'HHmm')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      paymentDate: format(new Date(), 'PP p'),
      paymentMethod: method,
    };
    setCurrentReceipt(receipt);
    setCurrentPage(Page.RECEIPT);
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.HOME:
        return (
          <>
            <Hero onGetQuote={() => setCurrentPage(Page.QUOTE)} />
            
            {/* About Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 relative">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl" />
                  <img 
                    src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2670&auto=format&fit=crop" 
                    alt="Corporate Office" 
                    className="rounded-[3rem] shadow-2xl relative z-10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-10 -right-10 bg-brand-blue p-8 rounded-3xl shadow-xl z-20 hidden md:block">
                    <p className="text-3xl font-display font-black text-brand-gold">15+</p>
                    <p className="text-white text-xs font-bold uppercase tracking-widest mt-2">Years of Excellence</p>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <span className="text-brand-orange font-display font-bold uppercase tracking-widest text-xs mb-4 block">Our Story</span>
                  <h2 className="text-4xl md:text-5xl font-display font-black text-brand-blue mb-8 leading-tight">About Chikwa</h2>
                  <p className="text-gray-500 text-lg leading-relaxed mb-6 font-light">
                    {BRAND_STORY.introduction}
                  </p>
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-display font-bold text-brand-orange uppercase text-xs tracking-widest mb-2">Our Vision</h4>
                      <p className="text-sm text-zinc-600 italic">"{BRAND_STORY.vision}"</p>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-brand-orange uppercase text-xs tracking-widest mb-2">Our Mission</h4>
                      <p className="text-sm text-zinc-600 italic">"{BRAND_STORY.mission}"</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {BRAND_STORY.values.map((v, i) => (
                      <div key={i} className="flex items-center text-sm text-zinc-500">
                        <CheckCircle2 size={16} className="text-brand-orange mr-3" />
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <ServicesSection />

            {/* Clienteles & Bankers */}
            <section className="py-24 bg-zinc-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">
                  {/* Clients */}
                  <div className="bg-brand-blue/5 p-12 rounded-[3rem] border border-brand-blue/10">
                    <h3 className="text-2xl font-display font-black text-brand-blue uppercase tracking-tighter mb-8 flex items-center">
                      <div className="w-2 h-8 bg-brand-orange mr-3"></div>
                      Our Clienteles
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {['Zambia Air Force', 'Zambia Army', 'JICA', 'Government of Zambia', 'UNICEF', 'Private Sector'].map((client, i) => (
                        <div key={i} className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-zinc-100 text-sm font-bold text-brand-blue uppercase tracking-widest">
                          {client}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bankers */}
                  <div className="bg-brand-orange/5 p-12 rounded-[3rem] border border-brand-orange/10">
                    <h3 className="text-2xl font-display font-black text-brand-orange uppercase tracking-tighter mb-8 flex items-center">
                      <div className="w-2 h-8 bg-brand-blue mr-3"></div>
                      Our Bankers
                    </h3>
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-1">Bank Name</p>
                          <p className="text-lg font-display font-bold text-brand-blue">ATLAS MARA</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-brand-orange tracking-[0.2em] mb-1">Acc No</p>
                          <p className="font-mono text-xs font-bold text-zinc-500">0335952951018-ZMW</p>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-1">Bank Name</p>
                          <p className="text-lg font-display font-bold text-brand-blue">FNB BANK</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-brand-orange tracking-[0.2em] mb-1">Acc No</p>
                          <p className="font-mono text-xs font-bold text-zinc-500">62891674759</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Why Choose Us */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-display font-extrabold text-brand-blue mb-4">Why Choose Us</h2>
                <div className="w-16 h-1 bg-brand-gold mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                {WHY_CHOOSE_US.map((item, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-20 h-20 bg-brand-blue/95 rounded-full flex items-center justify-center text-brand-gold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      {item.icon === 'DollarSign' && <DollarSign size={32} />}
                      {item.icon === 'Clock' && <Clock size={32} />}
                      {item.icon === 'ShieldCheck' && <ShieldCheck size={32} />}
                      {item.icon === 'Smartphone' && <Smartphone size={32} />}
                    </div>
                    <h3 className="text-xl font-display font-bold text-brand-blue mb-3">{item.title}</h3>
                    <p className="text-gray-500 font-light leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-brand-blue text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-display font-bold mb-16">Client Testimonials</h2>
                <div className="grid md:grid-cols-2 gap-12">
                  {TESTIMONIALS.map((t, i) => (
                    <motion.div 
                      key={i} 
                      whileInHover={{ y: -5 }}
                      className="bg-white/5 border border-white/10 p-10 rounded-[2rem] text-left backdrop-blur-sm"
                    >
                      <div className="flex text-brand-gold mb-6">
                        {[...Array(t.rating)].map((_, i) => <Star key={i} size={20} fill="#D4AF37" />)}
                      </div>
                      <p className="text-xl italic font-light text-gray-300 leading-relaxed mb-8">"{t.text}"</p>
                      <p className="font-display font-bold text-brand-gold text-sm tracking-widest uppercase">— {t.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
      case Page.FLEET:
        return (
          <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
              <span className="text-brand-gold font-display font-bold uppercase tracking-[0.3em] text-xs mb-4 block">The Fleet</span>
              <h2 className="text-5xl font-display font-black text-brand-blue mb-6">Our Exceptional Cars</h2>
              <div className="w-16 h-1 bg-brand-gold mx-auto"></div>
              {user && (
                <button
                  onClick={() => setCurrentPage(Page.ADMIN)}
                  className="mt-8 inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-orange transition-all shadow-lg"
                >
                  <Settings size={14} /> Manage Fleet
                </button>
              )}
            </motion.div>
            <FleetGrid onBookCar={(car) => { setSelectedCarForQuote(car); setCurrentPage(Page.QUOTE); }} />
          </section>
        );
      case Page.QUOTE:
        return (
          <section className="py-32 px-4 sm:px-6 lg:px-8">
            {currentQuote ? (
              <QuoteResult quote={currentQuote} onConvert={convertToInvoice} />
            ) : (
              <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                  <h2 className="text-5xl font-display font-black text-brand-blue mb-4 uppercase">Instant Quote</h2>
                  <p className="text-zinc-400 font-medium">Get a professional itemised breakdown for your rental in seconds.</p>
                </motion.div>
                <QuoteFormCard initialCar={selectedCarForQuote} onSubmit={generateQuote} />
              </div>
            )}
          </section>
        );
      case Page.INVOICE:
        return (
          <section className="py-32 px-4 sm:px-6 lg:px-8">
            {currentInvoice && (
              <InvoiceResult invoice={currentInvoice} onPay={markAsPaid} />
            )}
          </section>
        );
      case Page.RECEIPT:
        return (
          <section className="py-32 px-4 sm:px-6 lg:px-8">
            {currentReceipt && (
              <ReceiptResult receipt={currentReceipt} />
            )}
          </section>
        );
      case Page.ADMIN:
        return user ? <AdminDashboard /> : <AdminLoginForm onLogin={() => setUser({ uid: 'local-admin' } as any)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage={currentPage} onLogout={() => setUser(null)} onPageChange={(p) => {
        if (p === Page.QUOTE) {
          setCurrentQuote(null);
          setCurrentInvoice(null);
          setCurrentReceipt(null);
        }
        setCurrentPage(p);
      }} user={user} />
      
      <WhatsAppButton />
      
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (currentQuote?.reference || '')} // Force re-animation when quote is generated
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white pt-20 pb-10 border-t border-brand-orange/10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-brand-orange rounded flex items-center justify-center mr-3">
                <CarIcon size={20} className="text-white" />
              </div>
              <span className="font-display font-black text-2xl tracking-tighter uppercase">Chikwa</span>
            </div>
            <p className="text-gray-400 font-light leading-relaxed">
              {BRAND_STORY.introduction}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all"><Twitter size={18} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-8 text-brand-gold">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Our Fleet</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-8 text-brand-gold">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin size={16} className="mr-3 text-brand-gold shrink-0" />
                <span>Lusaka Business District,<br />Lusaka, Zambia</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-3 text-brand-gold" />
                <span>{COMPANY_DETAILS.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-3 text-brand-gold" />
                <span>{COMPANY_DETAILS.email}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-8 text-brand-gold">Newsletter</h4>
            <p className="text-gray-400 text-xs mb-4">Get exclusive offers and travel updates.</p>
            <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <input type="email" placeholder="Email Address" className="bg-transparent px-4 py-3 text-xs w-full outline-none" />
              <button className="bg-brand-gold text-brand-blue px-4 font-bold uppercase text-[10px] tracking-widest">Join</button>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <p>© {new Date().getFullYear()} Chikwa Car Hire Limited. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Built for Excellence in Zambia</p>
        </div>
      </div>
    </footer>
  );
};

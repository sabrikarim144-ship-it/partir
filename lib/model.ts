export type Item = { id: string; label: string; category: string; done: boolean };
export type Draft = { destination: string; start: string; end: string; purpose: string; lodging: string; activities: string[] };
export type Trip = Draft & { id: string; items: Item[]; archived: boolean; feedback?: { rating: number; note: string; forgotten: string } };
export type Profile = { name: string; email: string; light: boolean; notes: string; memories: string[] };
export type Store = { profile: Profile; trips: Trip[]; signedIn: boolean };
export const STORAGE_KEY = 'partir-v1';
export const emptyDraft: Draft = { destination: '', start: '', end: '', purpose: 'Loisir', lodging: 'Hôtel', activities: [] };
export function days(start: string, end: string) { return Math.max(1, Math.round((Date.parse(end) - Date.parse(start)) / 86400000)); }
export function validDates(start: string, end: string) { return Number.isFinite(Date.parse(start)) && Number.isFinite(Date.parse(end)) && end >= start; }
export function makeItems(draft: Draft, profile: Profile): Item[] {
 const groups: Record<string,string[]> = {
 'Ma valise': [profile.light ? 'Tenues polyvalentes et légères' : 'Tenues pour chaque jour', 'Sous-vêtements', 'Chaussures confortables', 'Veste légère'],
 'Documents': ['Pièce d’identité ou passeport', 'Billets et réservations', 'Vérifier les formalités officielles de destination'],
 'Électronique': ['Téléphone et chargeur', 'Batterie externe', 'Vérifier le besoin d’un adaptateur'],
 'Toilette': ['Brosse à dents et dentifrice', 'Produits de toilette', 'Traitements habituels, si nécessaires'],
 'À faire': ['Vérifier son assurance voyage', 'Télécharger les réservations', 'Prévenir un proche'] };
 if (days(draft.start,draft.end) > 7) groups['Ma valise'].push('Prévoir une lessive sur place');
 if (draft.purpose !== 'Loisir') { groups['Ma valise'].push('Tenue professionnelle'); groups['Électronique'].push('Ordinateur et chargeur'); groups['À faire'].push('Préparer les documents de travail'); }
 if (draft.lodging === 'Location') groups['À faire'].push('Confirmer les instructions d’arrivée');
 if (draft.lodging === 'Famille / amis') groups['Ma valise'].push('Petite attention pour vos hôtes');
 if (draft.activities.includes('Randonnée')) groups['Ma valise'].push('Chaussures de randonnée', 'Gourde');
 if (draft.activities.includes('Plage')) groups['Ma valise'].push('Maillot de bain', 'Protection solaire');
 if (draft.activities.includes('Sport')) groups['Ma valise'].push('Tenue de sport');
 if (profile.memories.length) groups['À ne plus oublier'] = [...new Set(profile.memories)];
 return Object.entries(groups).flatMap(([category,labels])=>labels.map((label,i)=>({id:`${category}-${i}`,label,category,done:false})));
}
export function createTrip(draft: Draft, profile: Profile): Trip { return {...draft, destination: draft.destination.trim(), id: crypto.randomUUID(), items: makeItems(draft,profile), archived: false}; }
export function progress(trip: Trip) { return trip.items.length ? Math.round(trip.items.filter(i=>i.done).length / trip.items.length * 100) : 0; }
export function initialStore(): Store {
 const profile: Profile = {name:'Karim',email:'',light:true,notes:'',memories:[]};
 const demo: Draft = {destination:'Lisbonne',start:'2026-11-12',end:'2026-11-18',purpose:'Loisir',lodging:'Hôtel',activities:['Culture','Gastronomie']};
 const trip = createTrip(demo,profile); trip.id='demo-lisbonne'; trip.items=trip.items.map((i,n)=>({...i,done:n<6}));
 return {profile,trips:[trip],signedIn:false};
}
export function readStore(raw: string | null): Store | null {
 try { const s = JSON.parse(raw || 'null');
 if (!s || typeof s.signedIn !== 'boolean' || !s.profile || typeof s.profile.name !== 'string' || typeof s.profile.email !== 'string' || typeof s.profile.notes !== 'string' || typeof s.profile.light !== 'boolean' || !Array.isArray(s.profile.memories) || !s.profile.memories.every((m:unknown)=>typeof m==='string') || !Array.isArray(s.trips)) return null;
 if(!s.trips.every((t:Trip)=>typeof t.id==='string' && typeof t.destination==='string' && validDates(t.start,t.end) && typeof t.purpose==='string' && typeof t.lodging==='string' && Array.isArray(t.activities) && t.activities.every(a=>typeof a==='string') && typeof t.archived==='boolean' && Array.isArray(t.items) && t.items.every(i=>typeof i.id==='string' && typeof i.label==='string' && typeof i.category==='string' && typeof i.done==='boolean')))return null;
 return s as Store; } catch {return null;}
}

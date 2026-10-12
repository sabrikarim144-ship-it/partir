import test from 'node:test';
import assert from 'node:assert/strict';
import { makeItems, days, validDates, readStore, initialStore } from '../lib/model.ts';
const profile={name:'Karim',email:'test@example.com',light:true,notes:'',memories:['Lunettes de soleil']};
const draft={destination:'Tokyo',start:'2026-11-12',end:'2026-11-20',purpose:'Professionnel',lodging:'Location',activities:['Randonnée']};
test('La checklist combine durée, activités, travail, hébergement et mémoire',()=>{const labels=makeItems(draft,profile).map(i=>i.label);for(const item of ['Prévoir une lessive sur place','Ordinateur et chargeur','Chaussures de randonnée','Confirmer les instructions d’arrivée','Lunettes de soleil','Tenues polyvalentes et légères']) assert.ok(labels.includes(item),item);assert.equal(new Set(makeItems(draft,profile).map(i=>i.id)).size,labels.length)});
test('Les dates sont validées sans accepter un retour avant le départ',()=>{assert.equal(days(draft.start,draft.end),8);assert.equal(validDates(draft.end,draft.start),false);assert.equal(validDates('',''),false);assert.equal(validDates(draft.start,draft.start),true)});
test('Une sauvegarde malformée ne bloque pas le démarrage',()=>{assert.equal(readStore('{'),null);assert.equal(readStore('{"signedIn":true}'),null);const s=initialStore();assert.deepEqual(readStore(JSON.stringify(s)),s)});

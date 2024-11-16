// src/components/BlindTastingApp.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Lock, Plus, RefreshCw, Mail } from 'lucide-react';

interface Collection {
  name: string;
  type: 'whiskey' | 'rum';
  bottles: string[];
  isActive: boolean;
}

interface Participant {
  email: string;
  number: number;
  bottle: string;
}

const BlindTastingApp = () => {
  // State declarations with proper typing
  const [collection, setCollection] = useState<Collection>({
    name: '',
    type: 'whiskey',
    bottles: [],
    isActive: false
  });
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [newBottle, setNewBottle] = useState<string>('');
  const [participantEmail, setParticipantEmail] = useState<string>('');

  useEffect(() => {
    if (collection.bottles.length > 0) {
      setAvailableNumbers(Array.from({ length: collection.bottles.length }, (_, i) => i + 1));
    }
  }, [collection.bottles]);

  const createNewCollection = () => {
    setCollection({
      name: '',
      type: 'whiskey',
      bottles: [],
      isActive: false
    });
    setParticipants([]);
    setAvailableNumbers([]);
    setShowAdmin(false);
  };

  const addBottle = () => {
    if (newBottle.trim() && !collection.isActive) {
      setCollection((prev: Collection) => ({
        ...prev,
        bottles: [...prev.bottles, newBottle.trim()]
      }));
      setNewBottle('');
    }
  };

  const startTasting = () => {
    if (collection.bottles.length > 0) {
      setCollection((prev: Collection) => ({ ...prev, isActive: true }));
    }
  };

  const assignNumber = async () => {
    if (!participantEmail || availableNumbers.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers[randomIndex];
    
    const newParticipant: Participant = {
      email: participantEmail,
      number: selectedNumber,
      bottle: collection.bottles[selectedNumber - 1]
    };
    
    setParticipants((prev: Participant[]) => [...prev, newParticipant]);
    setAvailableNumbers((prev: number[]) => prev.filter(num => num !== selectedNumber));
    setParticipantEmail('');
    
    alert(`Email sent to ${participantEmail} with assignment #${selectedNumber}`);
  };

  const endTasting = () => {
    setShowAdmin(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              Magnificent Bastards - Blind Spirit Tasting Manager
            </h1>
            <button 
              onClick={createNewCollection}
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              New Collection
            </button>
          </div>

          {!collection.isActive && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Collection Name"
                  value={collection.name}
                  onChange={(e) => setCollection((prev: Collection) => ({ ...prev, name: e.target.value }))}
                  className="border rounded px-3 py-2 max-w-xs"
                />
                <select
                  value={collection.type}
                  onChange={(e) => setCollection((prev: Collection) => ({ ...prev, type: e.target.value as 'whiskey' | 'rum' }))}
                  className="border rounded px-3 py-2"
                >
                  <option value="whiskey">Whiskey</option>
                  <option value="rum">Rum</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add bottle to collection"
                  value={newBottle}
                  onChange={(e) => setNewBottle(e.target.value)}
                  className="border rounded px-3 py-2 flex-1"
                />
                <button 
                  onClick={addBottle}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              
              {collection.bottles.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Collection Contents:</h3>
                  <ul className="list-disc pl-6">
                    {collection.bottles.map((bottle: string, index: number) => (
                      <li key={index}>{bottle}</li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={startTasting}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <Lock className="w-4 h-4" />
                    Start Tasting
                  </button>
                </div>
              )}
            </div>
          )}
          
          {collection.isActive && !showAdmin && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-blue-700">
                  {availableNumbers.length} numbers remaining out of {collection.bottles.length} total
                </p>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  className="border rounded px-3 py-2 flex-1"
                />
                <button 
                  onClick={assignNumber}
                  disabled={availableNumbers.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  Get Assignment
                </button>
              </div>
              
              {availableNumbers.length === 0 && (
                <button 
                  onClick={endTasting}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Close Tasting & Show Admin Panel
                </button>
              )}
            </div>
          )}
          
          {showAdmin && (
            <div className="space-y-4">
              <h3 className="font-semibold">Administrator View - Assignments</h3>
              <div className="grid grid-cols-2 gap-4">
                {participants.map((participant: Participant, index: number) => (
                  <div key={index} className="p-3 border rounded">
                    <div>Email: {participant.email}</div>
                    <div>Number: {participant.number}</div>
                    <div>Bottle: {participant.bottle}</div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={createNewCollection}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <RefreshCw className="w-4 h-4" />
                Start New Collection
              </button>
            </div>
          )}
        </div>
      </div>
      
      <footer className="text-center py-4 text-gray-600 text-sm">
        created by SJQ
      </footer>
    </div>
  );
};

export default BlindTastingApp;
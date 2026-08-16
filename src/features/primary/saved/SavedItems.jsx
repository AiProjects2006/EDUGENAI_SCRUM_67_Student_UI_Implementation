import React, { useState, useEffect } from 'react';
import { useSaved } from '../../../context/SavedContext';
import { useOceanAudio } from '../../../context/AudioContext';
import './SavedItems.css';

const SavedItems = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const { triggerMascotVoice } = useOceanAudio();
  const { savedItems, removeItem } = useSaved();

  useEffect(() => {
    triggerMascotVoice("Let's look at your Treasure Chest! Here are all your saved items.");
  }, [triggerMascotVoice]);

  const handleDelete = (id, type) => {
    removeItem(id, type);
  };

  const filteredItems = savedItems.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="saved-items-page">
      <div className="saved-header glass-panel">
        <h2>Your Treasure Chest ⭐</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search saved items..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="saved-categories">
        {['All', 'Courses', 'Modules', 'Notes', 'Activities'].map(f => (
          <button 
            key={f} 
            className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="saved-grid">
        {filteredItems.length === 0 ? (
          <div className="no-items">No treasures found!</div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="saved-card glass-panel">
              <div className="saved-icon">{item.icon}</div>
              <div className="saved-info">
                <h3>{item.title}</h3>
                <p>{item.type} • {item.time}</p>
              </div>
              <button className="remove-btn" onClick={() => handleDelete(item.id, item.type)}>✖</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedItems;

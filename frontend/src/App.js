import React, { useState, useEffect } from 'react';

const ContactsManager = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ phoneNumber: '', contactName: '' });
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showContacts, setShowContacts] = useState(false);

  const API_URL = 'http://localhost:8080';

  // Auto-dismiss notifications after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/contacts`);
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError('Failed to fetch contacts');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const addContact = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });
      
      if (response.ok) {
        setSuccess('Contact added successfully');
        setNewContact({ phoneNumber: '', contactName: '' });
        fetchContacts();
      } else {
        setError('Failed to add contact');
      }
    } catch (err) {
      setError('Failed to add contact');
    }
  };

  const searchContact = async () => {
    try {
      const response = await fetch(`${API_URL}/contacts/${searchNumber}`);
      const data = await response.json();
      setSearchResult(data.contactName);
    } catch (err) {
      setError('Failed to search contact');
    }
  };

  const deleteContact = async (phoneNumber) => {
    try {
      const response = await fetch(`${API_URL}/contacts/${phoneNumber}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSuccess('Contact deleted successfully');
        fetchContacts();
      }
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  const deleteAllContacts = async () => {
    if (window.confirm('Are you sure you want to delete all contacts?')) {
      try {
        const response = await fetch(`${API_URL}/contacts`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setSuccess('All contacts deleted successfully');
          setContacts([]);
        }
      } catch (err) {
        setError('Failed to delete all contacts');
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
  <div className="card" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
    <h1 style={{ marginBottom: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '2rem' }}>
      Contacts Manager
    </h1>

        {/* Notification System */}
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
          {error && (
            <div style={{ 
              padding: '10px 20px', 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              borderRadius: '4px',
              marginBottom: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              animation: 'slideIn 0.5s ease-out'
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ 
              padding: '10px 20px', 
              backgroundColor: '#d4edda', 
              color: '#155724', 
              borderRadius: '4px',
              marginBottom: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              animation: 'slideIn 0.5s ease-out'
            }}>
              {success}
            </div>
          )}
        </div>

        {/* Add Contact Form */}
        <form onSubmit={addContact} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Phone Number"
              value={newContact.phoneNumber}
              onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
            />
            <input
              type="text"
              placeholder="Contact Name"
              value={newContact.contactName}
              onChange={(e) => setNewContact({ ...newContact, contactName: e.target.value })}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
            />
            <button 
              type="submit"
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Contact
            </button>
          </div>
        </form>

        {/* Search Contact */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by Phone Number"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
          />
          <button
            onClick={searchContact}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </div>

        {/* Search Result */}
        {searchResult && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            Result: {searchResult}
          </div>
        )}

        {/* Contacts List Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => setShowContacts(!showContacts)}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#17a2b8', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showContacts ? 'Hide Contacts' : 'Show Contacts'}
          </button>
          <div>
            <button
              onClick={fetchContacts}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
            <button
              onClick={deleteAllContacts}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete All
            </button>
          </div>
        </div>

        {/* Contacts List */}
        {showContacts && (
          <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
            {contacts.map((contact, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '10px', 
                  borderBottom: index < contacts.length - 1 ? '1px solid #ddd' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold' }}>{contact.contactName}</span>
                  <span style={{ color: '#666', marginLeft: '10px' }}>{contact.phoneNumber}</span>
                </div>
                <button
                  onClick={() => deleteContact(contact.phoneNumber)}
                  style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
            {contacts.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No contacts found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add CSS animation for notifications */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ContactsManager;
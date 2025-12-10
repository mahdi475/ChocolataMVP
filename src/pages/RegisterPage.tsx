import React from 'react';

const RegisterPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Skapa Konto</h1>
      
      <form style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <input 
          type="text" 
          placeholder="Förnamn"
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        <input 
          type="text" 
          placeholder="Efternamn"
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        <input 
          type="email" 
          placeholder="E-post"
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        <input 
          type="password" 
          placeholder="Lösenord"
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        <input 
          type="password" 
          placeholder="Bekräfta lösenord"
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Skapa Konto
        </button>
      </form>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/login" style={{ color: '#007bff' }}>Har du redan ett konto? Logga in</a>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: '#007bff' }}>← Tillbaka till startsidan</a>
      </div>
    </div>
  );
};

export default RegisterPage;


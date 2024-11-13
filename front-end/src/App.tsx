import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import AulaList from './components/AulaList';
import CreateAula from './components/CreateAula';
import EditAula from './components/Editaula';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [aulas, setAulas] = useState<any[]>([]);
  const [isCreatingAula, setIsCreatingAula] = useState(false);
  const [editingAulaId, setEditingAulaId] = useState<number | null>(null);
  const [instrutores, setInstrutores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Para indicar o carregamento de dados

  const handleLogin = (token: string) => {
    setToken(token);
  };

  const handleLogout = () => {
    setToken(null);
    setUserData(null);
    setAulas([]);
    localStorage.removeItem('token');
  };

  const handleCreateAula = () => {
    setIsCreatingAula(true);
  };

  const handleAulaCreated = (novaAula: any) => {
    setIsCreatingAula(false);
    setAulas((prevAulas) => [...prevAulas, novaAula]);
  };

  const handleAulaUpdated = (updatedAula: any) => {
    setAulas((prevAulas) => prevAulas.map((aula) => (aula.id === updatedAula.id ? updatedAula : aula)));
    setEditingAulaId(null);
  };

  const fetchAulas = () => {
    if (token) {
      setIsLoading(true);
      axios
        .get('http://localhost:8000/api/aulas/', { headers: { Authorization: `Token ${token}` } })
        .then((response) => {
          setAulas(response.data.map((aula: any) => ({
            ...aula,
            inscrito: userData && aula.participantes.some((p: any) => p.aluno === userData.id),
          })));
          setIsLoading(false);
        })
        .catch((err) => {
          setError('Erro ao buscar aulas');
          setIsLoading(false);
        });
    }
  };

  const fetchInstrutores = () => {
    if (token) {
      axios
        .get('http://localhost:8000/api/instrutores/', { headers: { Authorization: `Token ${token}` } })
        .then((response) => {
          setInstrutores(response.data);
        })
        .catch((err) => {
          setError('Erro ao buscar instrutores');
        });
    }
  };

  const handleDeleteAula = (id: number) => {
    if (token) {
      axios
        .delete(`http://localhost:8000/api/aulas/${id}/`, { headers: { Authorization: `Token ${token}` } })
        .then(() => {
          setAulas((prevAulas) => prevAulas.filter((aula) => aula.id !== id));
        })
        .catch((err) => {
          setError('Erro ao excluir aula');
        });
    }
  };

  const handleEditAula = (id: number) => {
    setEditingAulaId(id);
  };

  const handleInscreverAula = (id: number) => {
    if (token) {
      axios
        .post(`http://localhost:8000/api/aulas/${id}/inscricao/`, {}, { headers: { Authorization: `Token ${token}` } })
        .then(() => {
          setAulas((prevAulas) => prevAulas.map((aula) => (aula.id === id ? { ...aula, inscrito: true } : aula)));
        })
        .catch((err) => {
          setError('Erro ao inscrever na aula');
        });
    }
  };

  useEffect(() => {
    if (token) {
      // Buscar dados do usuário
      setIsLoading(true);
      axios
        .get('http://localhost:8000/api/user/', { headers: { Authorization: `Token ${token}` } })
        .then((response) => {
          setUserData(response.data);
          fetchAulas();  // Carregar as aulas quando o token estiver disponível
          fetchInstrutores(); // Carregar os instrutores quando o token estiver disponível
        })
        .catch((err) => {
          setError('Erro ao buscar dados do usuário');
          setIsLoading(false);
        });
    }
  }, [token]);

  return (
    <div>
      {token ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <h2>Aulas</h2>
          <button onClick={handleCreateAula}>Adicionar Aula</button>
          {isCreatingAula && <CreateAula token={token} onAulaCreated={handleAulaCreated} />}
          
          {editingAulaId ? (
            <EditAula 
              token={token} 
              aulaId={editingAulaId} 
              onAulaUpdated={handleAulaUpdated}
              instrutores={instrutores} 
            />
          ) : (
            <>
              {isLoading ? (
                <p>Carregando aulas...</p>
              ) : (
                <AulaList
                  aulas={aulas}
                  onDelete={handleDeleteAula}
                  onEdit={handleEditAula}
                  onInscrever={handleInscreverAula}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CreateAulaProps {
  token: string;
  onAulaCreated: (novaAula: any) => void; // Atualizado para aceitar um parâmetro
}

const CreateAula: React.FC<CreateAulaProps> = ({ token, onAulaCreated }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [instrutor, setInstrutor] = useState<string>(''); 
  const [instrutores, setInstrutores] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInstrutores = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/instrutores/', {
          headers: { Authorization: `Token ${token}` },
        });
        if (Array.isArray(response.data) && response.data.length > 0) {
          setInstrutores(response.data);
        } else {
          setError('Nenhum instrutor encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar instrutores');
      }
    };
    fetchInstrutores();
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!titulo || !descricao || !data || !instrutor) {
      setError('Título, descrição, data e instrutor são obrigatórios');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/aulas/',
        { titulo, descricao, data, instrutor },
        { headers: { Authorization: `Token ${token}` } }
      );
      setTitulo('');
      setDescricao('');
      setData('');
      setInstrutor('');
      onAulaCreated(response.data); // Passando a nova aula para a função callback
    } catch (err) {
      setError('Erro ao criar aula');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3>Adicionar Aula</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        <div>
          <label>Data:</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <div>
          <label>Instrutor:</label>
          <select value={instrutor} onChange={(e) => setInstrutor(e.target.value)}>
            <option value="">Selecione um instrutor</option>
            {instrutores.length > 0 ? (
              instrutores.map((instrutor) => (
                <option key={instrutor.id} value={instrutor.id}>
                  {instrutor.username}
                </option>
              ))
            ) : (
              <option value="">Nenhum instrutor encontrado</option>
            )}
          </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Criar Aula'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateAula;

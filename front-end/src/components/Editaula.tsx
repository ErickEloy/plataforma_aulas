import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EditAulaProps {
  token: string;
  aulaId: number;
  onAulaUpdated: (updatedAula: any) => void; // Atualizado para aceitar um parâmetro
  instrutores: any[];
}

const EditAula: React.FC<EditAulaProps> = ({ token, aulaId, onAulaUpdated, instrutores }) => {
  const [aula, setAula] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [instrutor, setInstrutor] = useState<string>(''); 
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/aulas/${aulaId}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => {
        const aulaData = response.data;
        setAula(aulaData);
        setTitulo(aulaData.titulo);
        setDescricao(aulaData.descricao);
        setData(aulaData.data);
        setInstrutor(aulaData.instrutor ? aulaData.instrutor.id : '');
      })
      .catch((err) => {
        setError('Erro ao carregar aula');
      });
  }, [aulaId, token]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titulo || !descricao || !data || !instrutor) {
      setError('Título, descrição, data e instrutor são obrigatórios');
      return;
    }

    setIsLoading(true);

    const updatedAula = {
      titulo,
      descricao,
      data,
      instrutor,
    };

    axios
      .put(`http://localhost:8000/api/aulas/${aulaId}/`, updatedAula, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => {
        setIsLoading(false);
        onAulaUpdated(response.data); // Passando a aula atualizada para a função callback
      })
      .catch((err) => {
        setIsLoading(false);
        setError('Erro ao atualizar aula');
      });
  };

  return (
    <div>
      <h3>Editar Aula</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading && <p>Carregando...</p>}
      {aula ? (
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </label>
          <br />
          <label>
            Descrição:
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </label>
          <br />
          <label>
            Data:
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </label>
          <br />
          <label>
            Instrutor:
            <select
              value={instrutor}
              onChange={(e) => setInstrutor(e.target.value)}
            >
              <option value="">Selecione o instrutor</option>
              {instrutores.map((instrutor: any) => (
                <option key={instrutor.id} value={instrutor.id}>
                  {instrutor.username}
                </option>
              ))}
            </select>
          </label>
          <br />
          <button type="submit">Atualizar Aula</button>
        </form>
      ) : (
        <p>Carregando dados da aula...</p>
      )}
    </div>
  );
};

export default EditAula;

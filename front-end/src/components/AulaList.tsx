import React from 'react';

interface Aula {
  id: number;
  titulo: string;
  descricao: string;
  instrutor_nome: string;
  data: string;
  inscrito: boolean;  // Novo campo para verificar se o usuário está inscrito
}

interface AulaListProps {
  aulas: Aula[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onInscrever: (id: number) => void;  // Função para inscrição
}

const AulaList: React.FC<AulaListProps> = ({ aulas, onDelete, onEdit, onInscrever }) => {

  // Função para formatar a data no formato 'dd/mm/yyyy'
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <h1>Lista de Aulas</h1>
      <ul>
        {aulas.map((aula) => (
          <li key={aula.id}>
            <h3>{aula.titulo}</h3>
            <p>{aula.descricao}</p>
            <p><strong>Instrutor:</strong> {aula.instrutor_nome}</p>
            <p><strong>Data:</strong> {formatDate(aula.data)}</p>
            <button onClick={() => onEdit(aula.id)}>Editar</button>
            <button onClick={() => onDelete(aula.id)}>Excluir</button>
            {!aula.inscrito ? (
              <button onClick={() => onInscrever(aula.id)}>Inscrever</button>
            ) : (
              <p>Você já está inscrito nesta aula</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AulaList;

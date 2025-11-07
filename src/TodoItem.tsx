import React, { useState, useRef, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface Props {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodoTitle: (id: number, title: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodo,
  deleteTodo,
  updateTodoTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleTitleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle) {
      updateTodoTitle(todo.id, trimmedTitle);
      setIsEditing(false);
    } else {
      deleteTodo(todo.id);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  const handleBlur = () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle) {
      updateTodoTitle(todo.id, trimmedTitle);
      setIsEditing(false);
    } else {
      deleteTodo(todo.id);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleTitleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={handleDoubleClick}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};

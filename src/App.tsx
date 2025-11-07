import React, { useState, useMemo, useEffect } from 'react';
import { TodoItem } from './TodoItem';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

const getInitialTodos = (): Todo[] => {
  const storedTodos = localStorage.getItem('todos');

  return storedTodos ? JSON.parse(storedTodos) : [];
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(getInitialTodos);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filterBy, setFilterBy] = useState<FilterType>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;
  const areAllCompleted = todos.length > 0 && activeTodosCount === 0;

  const handleNewTodoSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (trimmedTitle) {
      const newTodo: Todo = {
        id: +new Date(),
        title: trimmedTitle,
        completed: false,
      };

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setNewTodoTitle('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const toggleAll = () => {
    setTodos(currentTodos =>
      currentTodos.map(todo => ({ ...todo, completed: !areAllCompleted })),
    );
  };

  const clearCompleted = () => {
    setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
  };

  const updateTodoTitle = (id: number, title: string) => {
    setTodos(currentTodos =>
      currentTodos.map(todo => (todo.id === id ? { ...todo, title } : todo)),
    );
  };

  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              aria-label="Toggle All"
              className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form onSubmit={handleNewTodoSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  toggleTodo={toggleTodo}
                  deleteTodo={deleteTodo}
                  updateTodoTitle={updateTodoTitle}
                />
              ))}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${activeTodosCount} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={`filter__link ${filterBy === 'all' ? 'selected' : ''}`}
                  data-cy="FilterLinkAll"
                  onClick={() => setFilterBy('all')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={`filter__link ${filterBy === 'active' ? 'selected' : ''}`}
                  data-cy="FilterLinkActive"
                  onClick={() => setFilterBy('active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={`filter__link ${filterBy === 'completed' ? 'selected' : ''}`}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setFilterBy('completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={clearCompleted}
                disabled={completedTodosCount === 0}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

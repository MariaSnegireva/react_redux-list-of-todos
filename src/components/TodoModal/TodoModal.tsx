import React, { useState, useEffect } from 'react';
import { Loader } from '../Loader';
import { User } from '../../types/User';
import { useAppSelector } from '../../app/hooks';
import { useDispatch } from 'react-redux';
import { getUser } from '../../api';
import { actions as currTodosActions } from '../../features/currentTodo';
import cn from 'classnames';

export const TodoModal: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const currentTodo = useAppSelector(state => state.currentTodo);

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async (id: number) => {
      try {
        const data = await getUser(id);

        if (!data) {
          return;
        }

        setUser(data);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentTodo) {
      fetchUser(currentTodo.userId);
    }
  }, [currentTodo]);

  if (!currentTodo) {
    return null;
  }

  return (
    <div className="modal is-active" data-cy="modal">
      <div className="modal-background" />

      {isLoading
        ? (<Loader />)
        : (
          <div className="modal-card">
            <header className="modal-card-head">
              <div
                className="modal-card-title has-text-weight-medium"
                data-cy="modal-header"
              >
                Todo {currentTodo.id}
              </div>

              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <button
                type="button"
                className="delete"
                data-cy="modal-close"
                onClick={() => dispatch(currTodosActions.removeTodo())}
              />
            </header>

            <div className="modal-card-body">
              <p className="block" data-cy="modal-title">
                {currentTodo.title}
              </p>

              <p className="block" data-cy="modal-user">
                {/* For not completed */}
                <strong
                  className={cn({
                    'has-text-succes': currentTodo,
                    'has-text-danger': !currentTodo,
                  })}
                >
                  {currentTodo.completed ? 'Done' : 'Planned'}
                </strong>
                {currentTodo.completed && (
                  <>
                    {' by '}
                    <a href={`mailto:${user?.email}`}>{user?.name}</a>
                  </>
                )}
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

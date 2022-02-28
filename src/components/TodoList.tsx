import { useState, useRef, useEffect } from 'react';
import { Todo as TodoProps, Todos } from '../model'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { MdDone } from 'react-icons/md'
import { Draggable, Droppable } from 'react-beautiful-dnd';

interface IProps {
    todos: Todos;
    todosSet: React.Dispatch<React.SetStateAction<Todos>>;
    completedTodos: Todos;
    completedTodosSet: React.Dispatch<React.SetStateAction<Todos>>;
}

export default function TodoList({ todos, todosSet, completedTodos, completedTodosSet }: IProps) {
    return (
        <div className="container">
            <Droppable droppableId='TodosList' >
                {(provided, snapshot) => (
                    <div className={`todos ${snapshot.isDraggingOver ? 'dragactive' : ''}`} ref={provided.innerRef} {...provided.droppableProps}>
                        <span className="todos__heading">Active Tasks</span>
                        {todos?.map((todo: TodoProps, idx: number) => <TodoItem index={idx} todo={todo} key={todo.id} todos={todos} todosSet={todosSet} />)}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Droppable droppableId='TodosRemove' >
                {(provided, snapshot) => (
                    <div className={`todos ${snapshot.isDraggingOver ? 'dragcomplete' : ''} remove`} ref={provided.innerRef} {...provided.droppableProps}>
                        <span className="todos__heading">Completed Tasks</span>
                        {completedTodos?.map((todo: TodoProps, idx: number) => <TodoItem index={idx} todo={todo} key={todo.id} todos={completedTodos} todosSet={completedTodosSet} />)}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}

// interface TodoItemProps extends IProps {
//     todo: TodoProps;
// }
interface TodoItemProps {
    index: number;
    todo: TodoProps;
    todos: Todos;
    todosSet: React.Dispatch<React.SetStateAction<Todos>>;
}

function TodoItem({ todo, todos, todosSet, index }: TodoItemProps) {
    const [edit, editSet] = useState<boolean>(false);
    const [editTodo, editTodoSet] = useState<string | number>(todo.todo);
    const inputEditRef = useRef<HTMLInputElement>(null);

    const handleIsDone = (id: number) => todosSet((t: Todos) => t?.map((item: TodoProps) => item.id !== id ? item : { ...item, isDone: !item.isDone }))
    const onDelete = (id: number) => todosSet(todos.filter((t: TodoProps) => t.id !== id));
    const handleEdit = () => {
        if (!edit && !todo.isDone) {
            editSet(!edit)
        }
        editSet(!edit)
    }
    function onSubmit(evt: React.FormEvent, todoId: number) {
        evt.preventDefault();
        if (edit && editTodo === '') {
            alert('Please enter a new tasks')
            return;
        }
        todosSet((prevTodo: Todos) => prevTodo?.map((t: any) => t.id === todoId ? { ...t, todo: editTodo } : t))
        editSet(false);
    }
    useEffect(() => inputEditRef.current?.focus(), [edit])
    return (
        <Draggable draggableId={todo.id.toString()} index={index}>
            {(provided, snapshot) => (
                <form className={`todos__todo_item ${snapshot.isDragging ? 'drag' : ''}`} 
                    onSubmit={(evt: React.FormEvent) => onSubmit(evt, todo.id)} 
                    ref={provided.innerRef}
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                >
                    {edit ? (
                        <input
                            type='text'
                            className="todos__todo--text"
                            ref={inputEditRef}
                            value={editTodo}
                            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => editTodoSet(evt.target.value)}
                        />
                    ) : (
                        <span className="todos__todo--text" style={{ textDecoration: todo.isDone ? 'line-through' : '' }}>{todo.todo}</span>
                    )
                    }
                    <div>
                        <span className='icon' onClick={handleEdit}>
                            <AiFillEdit />
                        </span>
                        <span className='icon' onClick={() => onDelete(todo.id)}>
                            <AiFillDelete />
                        </span>
                        <span className='icon' onClick={() => handleIsDone(todo.id)}>
                            <MdDone />
                        </span>
                    </div>
                </form>
            )}
        </Draggable>
    )
}
import { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import InputField from './components/InputField';
import TodoList from './components/TodoList';
import { Todos } from './model';

export default function App() {
	let jsonTodos = localStorage.getItem('todos');
	let jsonCompletedTodos = localStorage.getItem('completedTodos');
	const [todos, todosSet] = useState<Todos>([]);
	const [completedTodos, completedTodosSet] = useState<Todos>([]);
	function onDragEnd(res: DropResult) {
		const {source, destination} = res;
		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		let add, 
			active = todos, // ARRAY
			complete = completedTodos; // ARRAY

		// TODO: STUDY DRAG AND DROP LOGIC
		if (source.droppableId === 'TodosList') {
			add = active[source.index];
			active.splice(source.index, 1);
		} else {
			add = complete[source.index];
			complete.splice(source.index, 1);
		}
		if (destination.droppableId === 'TodosList') {
			active.splice(destination.index, 0, add);
		} else {
			complete.splice(destination.index, 0, add);
		}
		completedTodosSet(complete);
		todosSet(active);

	}
		let names = ['norrico', 'gerald', 'francis', 'baby'];
		for (let i = 0; i < names.length; i++) {
			if (names[i] == 'baby') {
				console.log(true);
			} else {
				console.log(false);
			}
		}
	useEffect(() => {
		if (jsonTodos !== null) 
			todosSet(JSON.parse(jsonTodos));
		
		if (jsonCompletedTodos !== null) {
			completedTodosSet(JSON.parse(jsonCompletedTodos))
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos))
		localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
	}, [todos.length, completedTodos.length, todos, completedTodos])
	return (
		<div className="App">
			<DragDropContext onDragEnd={onDragEnd}>
				<span className="heading">Tasks</span>
				<InputField
					todosSet={todosSet}
				/>
				<TodoList 
					todos={todos}
					todosSet={todosSet}
					completedTodos={completedTodos}
					completedTodosSet={completedTodosSet}
				/>
			</DragDropContext>
		</div>
	)
}
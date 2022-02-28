import {useState, useRef} from 'react';
import { SetStateAction } from "react";
import { Todo, Todos } from '../model';

interface IProps {
	// todo: string | number;
	// todoSet: React.Dispatch<React.SetStateAction<string | number>>;
	// addTodo: (evt: React.FormEvent) => void;
	todosSet: React.Dispatch<React.SetStateAction<Todos>>
}

export default function InputField({ todosSet }: IProps): React.ReactElement {
	const [todo, todoSet] = useState<string | number>('');
	const inputRef = useRef<HTMLInputElement>(null);
	function onChange(cb: React.Dispatch<React.SetStateAction<string | number>>) {
		return function (evt: { target: { value: SetStateAction<string | number>; }; }) {
			return cb(evt.target.value)
		}
	}
	const onSubmit = (evt: React.FormEvent) => {
		evt.preventDefault();
		evt.stopPropagation();

		if (todo) {
			todosSet((prevTodo: Todo[]) => [...prevTodo, {id: Date.now(), todo, isDone: false}])
			todoSet('');
			if (inputRef.current) {
				inputRef.current.blur();
			}
		} else {
			alert('Please provide a task')
		}
	}
	return (
		<form className="input" onSubmit={onSubmit}>
			<input type="text" placeholder="Enter a task" className="input__box" value={todo} onChange={onChange(todoSet)} ref={inputRef} />
			<button type='submit' className="input_submit">Go</button>
		</form>
	)
}
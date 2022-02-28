export interface Todo {
    id: number;
    todo: string|number;
    isDone: boolean;
}
export type Todos = Todo[];
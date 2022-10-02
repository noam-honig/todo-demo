import { useEffect, useState } from "react"
import { remult } from "remult";
import { Task } from "./shared/Task"
import { TasksController } from "./shared/TasksController";

const taskRepo = remult.repo(Task);


function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  useEffect(() => {
    taskRepo.find({
      where: {
        completed: undefined
      }
    }).then(setTasks);
  }, [])

  const addTask = async () => {
    const task = await taskRepo.insert({
      title: newTask
    });
    setTasks([...tasks, task]);
    setNewTask("");
  }

  const setAllCompleted = async (completed: boolean) => {
    await TasksController.setAllCompleted(completed);
    setTasks(await taskRepo.find());
  }

  return <>
    <h1>Todos</h1>
    <main>
      <input
        placeholder="What needs to be done"
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter")
            addTask()
        }}
      />
      <ul>
        {tasks.map(task => {

          const setCompleted = async (completed: boolean) => {
            const updatedTask = await taskRepo.save({
              ...task, completed
            });
            replaceTask(updatedTask);
          }
          const replaceTask = (updatedTask: Task) => {
            setTasks(tasks.map(t => t === task ? updatedTask : t));
          }

          const setTitle = (title: string) => {
            replaceTask({ ...task, title })
          }
          const saveTask = async () => {
            try {
              replaceTask(await taskRepo.save(task));
            } catch (error: any) {
              alert(error.message);
            }
          }

          const deleteTask = async () => {
            await taskRepo.delete(task);
            setTasks(tasks.filter(t => t !== task));
          }

          return <li key={task.id}>
            <input type="checkbox"
              checked={task.completed}
              onChange={e => setCompleted(e.target.checked)}
            />
            <input
              value={task.title}
              onChange={e => setTitle(e.target.value)}
              onBlur={saveTask}
            />
            <button onClick={deleteTask}>x</button>
          </li>
        })}
      </ul>
      <button onClick={() => setAllCompleted(true)} >Set All Completed</button>
      <button onClick={() => setAllCompleted(false)} >Set All UnCompleted</button>
    </main>
  </>
}

export default App

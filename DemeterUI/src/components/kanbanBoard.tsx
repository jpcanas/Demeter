import { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  status: TaskStatus;
  title: string;
  description: string;
};

export type ColumnType = {
  id: TaskStatus;
  title: string;
};

interface KanbanBoardProps {
  TaskList: Task[];
  KanbanColumns: ColumnType[];
}

export default function KanbanBoard({
  TaskList,
  KanbanColumns,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(TaskList);

  function handelDragEvent(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as String;
    const newStatus = over.id as Task["status"];

    setTasks(() =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  return (
    <div className="p-4">
      <div className="flex gap-8">
        <DndContext onDragEnd={handelDragEvent}>
          {KanbanColumns.map((column) => {
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)} // need to optimize
              />
            );
          })}
        </DndContext>
      </div>
    </div>
  );
}

// ==================== COLUMN Components ========================= //
type ColumnProps = {
  column: ColumnType;
  tasks: Task[];
};

// fetch the actual data in this component (for specific column)
function Column({ column, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex w-80 flex-col rounded-lg bg-muted p-4">
      <h2 className="mb-4 font-semibold ">{column.title}</h2>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
      </div>
    </div>
  );
}
// ===================================================//

// ==================== TaskCard Components ========================= //
type TaskCardProps = {
  task: Task;
};

function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const transformStyle = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg bg-background p-4 shadow-sm hover:shadow-md"
      style={transformStyle}
    >
      <h3 className="font-medium text-foreground">{task.title}</h3>
      <p className="mt-2 text-sm text-foreground">{task.description}</p>
    </div>
  );
}
// ===================================================//

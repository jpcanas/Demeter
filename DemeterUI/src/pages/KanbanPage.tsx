import KanbanBoard, { ColumnType, Task } from "@/components/KanbanBoard";

export default function KanbanPage() {
  // example datas
  const KanbanColumns: ColumnType[] = [
    { id: "TODO", title: "To Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "DONE", title: "Done" },
  ];

  const TaskList: Task[] = [
    {
      id: "1",
      title: "Research Project",
      description: "Gather requirements and create initial documentation",
      status: "TODO",
    },
    {
      id: "2",
      title: "Design System",
      description: "Create component library and design tokens",
      status: "TODO",
    },
    {
      id: "3",
      title: "API Integration",
      description: "Implement REST API endpoints",
      status: "IN_PROGRESS",
    },
    {
      id: "4",
      title: "Testing",
      description: "Write unit tests for core functionality",
      status: "DONE",
    },
  ];

  return (
    <>
      <h1>Kanban</h1>
      <KanbanBoard TaskList={TaskList} KanbanColumns={KanbanColumns} />
    </>
  );
}

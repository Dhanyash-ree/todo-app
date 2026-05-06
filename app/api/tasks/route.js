let tasks = [];

export async function GET() {
  return Response.json(tasks);
}

export async function POST(req) {
  const body = await req.json();

  // ✅ HANDLE RESET HERE
  if (body.type === "RESET") {
    tasks = body.tasks;
    return Response.json({ message: "Reset done" });
  }

  // Normal add
  tasks.push(body);
  return Response.json({ message: "Added" });
}

export async function PUT(req) {
  const { index } = await req.json();
  tasks[index].done = !tasks[index].done;
  return Response.json({ message: "Updated" });
}

export async function DELETE(req) {
  const { index } = await req.json();
  tasks.splice(index, 1);
  return Response.json({ message: "Deleted" });
}
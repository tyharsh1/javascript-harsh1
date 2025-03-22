export default function handler(req, res) {
  let tasks = [];

  if (req.method === "GET") {
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const { task } = req.body;
    tasks.push(task);
    return res.status(201).json({ message: "Task added", tasks });
  }

  if (req.method === "DELETE") {
    const { index } = req.body;
    tasks = tasks.filter((_, i) => i !== index);
    return res.status(200).json({ message: "Task deleted", tasks });
  }

  return res.status(405).end(); // Method Not Allowed
}

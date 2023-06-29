const { prisma } = require("../prisma/prisma-client");

/**
 * @route GET /api/employees
 * @desc Отримання всіх працівників
 * @access Private
 */
const all = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();

    res.status(200).json(employees);
  } catch {
    res.status(500).json({ message: "Не вдалося отримати працівника" });
  }
};

/**
 * @route POST /api/employees/add
 * @desc Додати працівника
 * @access Private
 */
const add = async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({ message: "Всі поля обов'язкові" });
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });

    return res.status(201).json(employee);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Щось пішло не так..." });
  }
};

/**
 * @route POST /api/empoyees/remove/:id
 * @desc Видалення працівника
 * @access Private
 */
const remove = async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.employee.delete({
      where: {
        id,
      },
    });

    res.status(204).json("OK");
  } catch {
    res.status(500).json({ message: "Не вдалося видалити працівника" });
  }
};

/**
 * @route PUT /api/empoyees/edit/:id
 * @desc Редагуваня працівника
 * @access Private
 */
const edit = async (req, res) => {
  const data = req.body;
  const id = data.id;

  try {
    await prisma.employee.update({
      where: {
        id,
      },
      data,
    });

    res.status(204).json("OK");
  } catch(err) {
    res.status(500).json({ message: "Не вдалося редагувати працівника" });
  }
};

/**
 * @route GET /api/employees/:id
 * @desc отримання працівника
 * @access Private
 */
const employee = async (req, res) => {
  const { id } = req.params; // http://localhost:8000/api/employees/9fe371c1-361f-494a-9def-465959ecc098

  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(employee);
  } catch {
    res.status(500).json({ message: "Не вдалося отримати працівника" });
  }
};

module.exports = {
  all,
  add,
  remove,
  edit,
  employee,
};
